import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "outline-dark";
type Size = "sm" | "md" | "lg";

/* Mobile frame: 13px DM Mono, 1px tracking, 12px vertical padding, full width. Desktop values return from md. */
const base =
  "inline-flex touch-manipulation items-center justify-center gap-2 font-mono uppercase leading-[19px] whitespace-nowrap md:leading-[16.5px] " +
  "transition-[transform,background-color,color,border-color] duration-200 ease-out-quint " +
  "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink";

const variants: Record<Variant, string> = {
  solid: "bg-pink text-white hover:bg-[#e6205f]",
  outline: "border border-pink text-pink hover:bg-pink/10",
  /* Pink text on the mobile frame, black on the desktop frame. */
  "outline-dark": "border border-pink text-pink hover:bg-pink/10 lg:text-black",
};

const sizes: Record<Size, string> = {
  /* Full-width rounded on mobile, the 46px desktop button from md (the hero squares its corners via className). */
  sm: "h-11 w-full rounded-[12px] px-6 text-[13px] font-medium tracking-[1px] md:h-[46px] md:w-auto md:text-[11px] md:tracking-[1.1px]",
  md: "px-6 py-3 text-[13px] tracking-[1px] md:py-4 md:text-[17px] md:tracking-[1.1px]",
  lg: "px-6 py-3 text-[13px] tracking-[1px] md:py-4 md:text-[20px] md:tracking-[1.1px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  rounded?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string; target?: string; rel?: string; "aria-label"?: string };
type NativeProps = CommonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: LinkProps | NativeProps) {
  const {
    variant = "solid",
    size = "md",
    rounded = false,
    icon,
    iconPosition = "right",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], rounded && "rounded-[12px]", className);
  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, target, rel, "aria-label": ariaLabel } = rest as LinkProps;
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} className={classes}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
