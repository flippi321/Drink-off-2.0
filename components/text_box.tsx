import { useId, useState } from "react";
import { TextBoxProps } from "@/lib/types/ui_types";

export function TextBox({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  variant = "text",
}: TextBoxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = variant === "password";

  const inputType =
    variant === "email" ? "email" : isPassword ? (showPassword ? "text" : "password") : "text";

  return (
    <div className="space-y-2">
      <label htmlFor={inputId}>{label}</label>

      {/* Wrapper only used to place the show/hide button without changing input styling */}
      <div className={isPassword ? "relative" : undefined}>
        <input
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-foreground/70 hover:text-foreground"
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
            title={showPassword ? "Skjul passord" : "Vis passord"}
          >
            {showPassword ? "Skjul" : "Vis"}
          </button>
        )}
      </div>
    </div>
  );
}