import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

type SpaceToken = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type ContainerWidth = "narrow" | "content" | "wide" | "full";
type SurfaceTone = "default" | "muted" | "strong";
type SurfacePadding = "sm" | "md" | "lg";
type TriggerVariant = "solid" | "outline" | "ghost";
type TriggerTone = "default" | "accent";
type TextTone = "default" | "muted" | "accent";
type HeadingSize = "card" | "section" | "hero";
type TextSize = "sm" | "md" | "lg";

const cx = (...values: Array<string | false | null | undefined>): string =>
  values.filter(Boolean).join(" ");

const toSpaceValue = (value?: SpaceToken | string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const tokenMap: Record<SpaceToken, string> = {
    "2xs": "var(--space-2xs)",
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
    "2xl": "var(--space-2xl)",
  };

  return tokenMap[value as SpaceToken] ?? value;
};

const toContainerWidth = (width: ContainerWidth): string => {
  if (width === "full") {
    return "100%";
  }

  return `var(--layout-${width})`;
};

interface SharedStyleProps {
  className?: string;
  style?: CSSProperties;
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement>, SharedStyleProps {
  width?: ContainerWidth;
}

export function Container({ width = "content", className, style, ...props }: ContainerProps) {
  return (
    <div
      className={cx("ui-container", className)}
      style={{ ...style, "--ui-container-max": toContainerWidth(width) } as CSSProperties}
      {...props}
    />
  );
}

interface StackProps extends HTMLAttributes<HTMLDivElement>, SharedStyleProps {
  gap?: SpaceToken | string;
  align?: CSSProperties["alignItems"];
}

export function Stack({ gap = "md", align, className, style, ...props }: StackProps) {
  return (
    <div
      className={cx("ui-stack", className)}
      style={{
        ...style,
        "--ui-stack-gap": toSpaceValue(gap),
        alignItems: align,
      } as CSSProperties}
      {...props}
    />
  );
}

interface InlineProps extends HTMLAttributes<HTMLDivElement>, SharedStyleProps {
  gap?: SpaceToken | string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
}

export function Inline({
  gap = "sm",
  align = "center",
  justify,
  wrap = false,
  className,
  style,
  ...props
}: InlineProps) {
  return (
    <div
      className={cx("ui-inline", wrap && "is-wrapping", className)}
      style={{
        ...style,
        "--ui-inline-gap": toSpaceValue(gap),
        alignItems: align,
        justifyContent: justify,
      } as CSSProperties}
      {...props}
    />
  );
}

interface GridProps extends HTMLAttributes<HTMLDivElement>, SharedStyleProps {
  gap?: SpaceToken | string;
  minItemWidth?: string;
}

export function Grid({
  gap = "md",
  minItemWidth = "16rem",
  className,
  style,
  ...props
}: GridProps) {
  return (
    <div
      className={cx("ui-grid", className)}
      style={{
        ...style,
        "--ui-grid-gap": toSpaceValue(gap),
        "--ui-grid-min": minItemWidth,
      } as CSSProperties}
      {...props}
    />
  );
}

interface SurfaceProps extends HTMLAttributes<HTMLElement>, SharedStyleProps {
  as?: "article" | "aside" | "div" | "section";
  tone?: SurfaceTone;
  padding?: SurfacePadding;
}

export function Surface({
  as: Component = "div",
  tone = "default",
  padding = "md",
  className,
  ...props
}: SurfaceProps) {
  return <Component className={cx("ui-surface", `is-${tone}`, `pad-${padding}`, className)} {...props} />;
}

interface PanelProps extends Omit<SurfaceProps, "tone"> {
  tone?: SurfaceTone;
}

export function Panel({ tone = "muted", className, ...props }: PanelProps) {
  return <Surface tone={tone} className={cx("ui-panel", className)} {...props} />;
}

interface ActionTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    SharedStyleProps {
  variant?: TriggerVariant;
  tone?: TriggerTone;
}

export const actionTriggerClassName = ({
  variant = "outline",
  tone = "default",
  active = false,
  className,
}: {
  variant?: TriggerVariant;
  tone?: TriggerTone;
  active?: boolean;
  className?: string;
} = {}): string =>
  cx(
    "ui-action-trigger",
    `is-${variant}`,
    `tone-${tone}`,
    active && "is-active",
    className,
  );

export function ActionTrigger({
  variant = "outline",
  tone = "default",
  className,
  type = "button",
  ...props
}: ActionTriggerProps) {
  return (
    <button
      type={type}
      className={actionTriggerClassName({ variant, tone, className })}
      {...props}
    />
  );
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>, SharedStyleProps {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: HeadingSize;
  children: ReactNode;
}

export function Heading({
  as: Component = "h2",
  size = "section",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component className={cx("ui-heading", `size-${size}`, className)} {...props}>
      {children}
    </Component>
  );
}

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement>, SharedStyleProps {
  children: ReactNode;
}

export function Eyebrow({ className, children, ...props }: EyebrowProps) {
  return (
    <p className={cx("ui-eyebrow", className)} {...props}>
      {children}
    </p>
  );
}

interface TextProps extends HTMLAttributes<HTMLParagraphElement>, SharedStyleProps {
  tone?: TextTone;
  size?: TextSize;
  children: ReactNode;
}

export function Text({
  tone = "default",
  size = "md",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <p className={cx("ui-text", `tone-${tone}`, `size-${size}`, className)} {...props}>
      {children}
    </p>
  );
}

interface ModalShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "title">, SharedStyleProps {
  title?: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
}

export function ModalShell({
  title,
  eyebrow,
  footer,
  className,
  children,
  ...props
}: ModalShellProps) {
  return (
    <div className="ui-modal-shell__backdrop">
      <div className={cx("ui-modal-shell", className)} role="dialog" aria-modal="true" {...props}>
        {(eyebrow || title) && (
          <header className="ui-modal-shell__header">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? <Heading as="h3" size="card">{title}</Heading> : null}
          </header>
        )}
        <div className="ui-modal-shell__body">{children}</div>
        {footer ? <div className="ui-modal-shell__footer">{footer}</div> : null}
      </div>
    </div>
  );
}

interface HintShellProps extends HTMLAttributes<HTMLDivElement>, SharedStyleProps {
  label?: ReactNode;
}

export function HintShell({ label, className, children, ...props }: HintShellProps) {
  return (
    <div className={cx("ui-hint-shell", className)} {...props}>
      {label ? <Eyebrow>{label}</Eyebrow> : null}
      <div className="ui-hint-shell__body">{children}</div>
    </div>
  );
}
