import type { InputHTMLAttributes } from "react";

type FieldProps = { label: string } & InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, className = "", ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/50">
        {label}
      </span>
      <input
        className={`min-h-12 w-full rounded-lg border border-white/12 bg-white/8 px-4 text-white outline-none placeholder:text-white/30 focus:border-surge/70 focus:ring-4 focus:ring-surge/10 ${className}`}
        {...props}
      />
    </label>
  );
}
