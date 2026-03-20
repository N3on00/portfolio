# Deployment

## Production target

- Domain: `portfolio.pegger.dev`
- Server: `89.167.118.25`
- Static app root on server: `/opt/portfolio`

## Current production shape

The portfolio is deployed as a static Vite build served by an `nginx:alpine` container.

Server-side layout:

- `/opt/portfolio/dist` contains the built frontend assets
- `/opt/portfolio/config/default.conf` contains the Nginx config for SPA routing
- `/opt/portfolio/docker-compose.yml` runs the `portfolio-frontend` container
- the container joins the existing Docker network `spotonsight_proxy`
- Caddy terminates TLS and reverse-proxies `portfolio.pegger.dev` to `portfolio-frontend:80`

## Deployment steps

1. Build the app locally with `npm run build`
2. Upload `dist/` to `/opt/portfolio/dist`
3. Ensure the portfolio container is running
4. Ensure the Caddy host entry for `portfolio.pegger.dev` exists
5. Reload or restart the proxy so the mounted config is active

## GitHub Actions

The repository now supports automated deployment from `main` through `.github/workflows/deploy.yml`.

The workflow:

1. checks out the repository
2. installs dependencies with `npm ci`
3. writes the SSH key from GitHub Secrets to a temporary file
4. runs `scripts/deploy-portfolio.sh`

## Required GitHub Secrets

Create these repository secrets:

- `DEPLOY_SSH_KEY`: private key that can SSH into the production server
- `DEPLOY_HOST`: production host, currently `89.167.118.25`
- `DEPLOY_USER`: SSH user, currently `root`
- `DEPLOY_PORT`: SSH port, usually `22`
- `DEPLOY_APP_DIR`: deploy target, currently `/opt/portfolio`
- `DEPLOY_CADDYFILE_PATH`: current proxy config path, `/opt/spotonsight/infrastructure/caddy/Caddyfile`

Recommended repository variable or secret values for the current setup:

```text
DEPLOY_HOST=89.167.118.25
DEPLOY_USER=root
DEPLOY_PORT=22
DEPLOY_APP_DIR=/opt/portfolio
DEPLOY_CADDYFILE_PATH=/opt/spotonsight/infrastructure/caddy/Caddyfile
```

## Notes from the current setup

- The target server already runs the shared reverse proxy container `spotonsight-proxy-1`
- The active Caddyfile is mounted from `/opt/spotonsight/infrastructure/caddy/Caddyfile`
- In the current server setup, a proxy restart was required once so the updated mounted Caddyfile became active inside the container
- The portfolio Nginx config must use `try_files $uri $uri/ /index.html;` so client-side routing works correctly

## Validation

Useful checks after deployment:

```bash
curl -I https://portfolio.pegger.dev
docker inspect portfolio-frontend --format='{{json .State.Health}}'
```

Expected result:

- `200 OK` from `https://portfolio.pegger.dev`
- healthy `portfolio-frontend` container
- valid certificate issuance in the proxy logs

## Security reminder

- Do not store deployment keys in this repository
- If a private key was ever committed elsewhere, rotate it and remove it from history
