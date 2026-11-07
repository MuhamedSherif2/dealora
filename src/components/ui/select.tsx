"use client";

import { useId, type SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };
type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
    label?: string;
    error?: string;
    options: Option[];
};

export default function Select({ label, error, options, id, className = "", ...props }: Props) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label && <label htmlFor={selectId} className="text-sm font-medium text-foreground">{label}</label>}
            <select
                id={selectId}
                aria-invalid={!!error}
                className={`h-11 w-full rounded-(--radius) border bg-card px-3 text-base text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 ${error ? "border-destructive focus-visible:ring-destructive" : "border-input focus-visible:ring-ring"
                    } ${className}`}
                {...props}
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    );
}