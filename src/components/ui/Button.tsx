import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<typeof variant, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-primary-500",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-primary-500"
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...rest}
    />
  );
}

