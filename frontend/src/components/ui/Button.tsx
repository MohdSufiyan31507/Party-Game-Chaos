import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Tone = "cyan" | "pink" | "orange" | "green" | "purple" | "ghost";

const tones: Record<Tone, string> = {
  cyan: "border-surge/50 bg-surge/15 text-surge shadow-glow hover:bg-surge/25",
  pink: "border-punch/50 bg-punch/15 text-punch shadow-hot hover:bg-punch/25",
  orange: "border-flare/50 bg-flare/15 text-flare hover:bg-flare/25",
  green: "border-lime/50 bg-lime/15 text-lime hover:bg-lime/25",
  purple: "border-plasma/50 bg-plasma/15 text-plasma hover:bg-plasma/25",
  ghost: "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
};

type ButtonProps = {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  to?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  icon: Icon,
  tone = "cyan",
  to,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-black uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-45 ${tones[tone]} ${className}`;

  if (to) {
    if (props.disabled) {
      return (
        <span aria-disabled="true" className={`${classes} cursor-not-allowed opacity-45`}>
          {Icon ? <Icon size={18} aria-hidden="true" /> : null}
          <span>{children}</span>
        </span>
      );
    }

    return (
      <Link to={to} className={classes}>
        {Icon ? <Icon size={18} aria-hidden="true" /> : null}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
