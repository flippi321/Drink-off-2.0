// ---------- INPUT FIELDS ----------
export type TextBoxProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  variant?: "text" | "email" | "password";
};

// ---------- BUTTONS ----------
export type CircularIcon =
  | "plus"
  | "qr"
  | "chevron-right"
  | "close"
  | "settings";

type BaseProps = {
  icon: CircularIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "inverted";
  className?: string;
  title?: string;
  "aria-label": string;
  disabled?: boolean;
};

export type CircularButtonProps = BaseProps & {
  onClick: ComponentProps<"button">["onClick"];
  type?: ComponentProps<"button">["type"];
};