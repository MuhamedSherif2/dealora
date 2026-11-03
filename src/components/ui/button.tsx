import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
};

function Spinner() {
    return (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    className = "",
    type = "button",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center cursor-pointer justify-center gap-2 rounded-[var(--radius)] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
    };

    const classes = [baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading}
            className={classes}
            {...props}
        >
            {loading && <Spinner />}
            {children}
        </button>
    );
}

export default Button;