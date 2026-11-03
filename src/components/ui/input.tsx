import { useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  error?: string;
  helperText?: string;
};

function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();

  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  const baseStyles =
    "w-full h-11 rounded-[var(--radius)] border bg-card px-4 text-sm text-card-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50";

  const errorStyles = error
    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
    : "border-input";

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}

          {props.required && (
            <span className="ms-1 text-destructive">*</span>
          )}
        </label>
      )}

      <input
        id={inputId}
        dir="auto"
        aria-invalid={!!error}
        aria-describedby={
          error || helperText ? messageId : undefined
        }
        className={`
          ${baseStyles}
          ${errorStyles}
          ${className}
        `}
        {...props}
      />

      {(error || helperText) && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={`text-xs ${
            error
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default Input;