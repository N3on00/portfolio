#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-89.167.118.25}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_PORT="${REMOTE_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/portfolio}"
CADDYFILE_PATH="${CADDYFILE_PATH:-/opt/spotonsight/infrastructure/caddy/Caddyfile}"
SSH_KEY_PATH="${SSH_KEY_PATH:-}"

if [[ -z "${SSH_KEY_PATH}" ]]; then
  echo "SSH_KEY_PATH is required"
  exit 1
fi

if [[ ! -f "${SSH_KEY_PATH}" ]]; then
  echo "SSH key not found: ${SSH_KEY_PATH}"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ssh_cmd() {
  ssh -i "${SSH_KEY_PATH}" -p "${REMOTE_PORT}" -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" "$@"
}

cd "${ROOT_DIR}"

npm run build

ssh_cmd "mkdir -p ${REMOTE_DIR}/dist ${REMOTE_DIR}/config"

tar -czf - dist | ssh -i "${SSH_KEY_PATH}" -p "${REMOTE_PORT}" -o StrictHostKeyChecking=accept-new \
  "${REMOTE_USER}@${REMOTE_HOST}" "rm -rf ${REMOTE_DIR}/dist/* && tar -xzf - -C ${REMOTE_DIR}"

ssh_cmd "cat > ${REMOTE_DIR}/config/default.conf <<'EOF'
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location = /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 'ok';
    }
}
EOF"

ssh_cmd "cat > ${REMOTE_DIR}/docker-compose.yml <<'EOF'
services:
  frontend:
    image: nginx:alpine
    container_name: portfolio-frontend
    restart: unless-stopped
    read_only: true
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./config/default.conf:/etc/nginx/conf.d/default.conf:ro
    healthcheck:
      test: [\"CMD-SHELL\", \"wget -qO- http://127.0.0.1/ >/dev/null\"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - edge

networks:
  edge:
    external: true
    name: spotonsight_proxy
EOF"

ssh_cmd "if ! grep -q 'portfolio.pegger.dev' ${CADDYFILE_PATH}; then cat >> ${CADDYFILE_PATH} <<'EOF'

portfolio.pegger.dev {
    encode zstd gzip
    import security_headers

    handle {
        reverse_proxy portfolio-frontend:80
    }
}
EOF
fi"

ssh_cmd "docker compose -f ${REMOTE_DIR}/docker-compose.yml up -d --force-recreate && docker restart spotonsight-proxy-1 >/dev/null"

ssh_cmd "curl -I https://portfolio.pegger.dev && docker inspect portfolio-frontend --format='{{json .State.Health}}'"
