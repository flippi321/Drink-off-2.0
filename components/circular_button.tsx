"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

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
};

type AsLinkProps = BaseProps & {
  href: string;
  onClick?: never;
  disabled?: boolean;
};

type AsButtonProps = BaseProps & {
  href?: never;
  onClick: ComponentProps<"button">["onClick"];
  disabled?: boolean;
  type?: ComponentProps<"button">["type"];
};

export type CircularButtonProps = AsLinkProps | AsButtonProps;

const SIZE: Record<NonNullable<CircularButtonProps["size"]>, string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

const ICON_SIZE: Record<NonNullable<CircularButtonProps["size"]>, number> = {
  sm: 18,
  md: 20,
  lg: 22,
};

function Icon({
  name,
  px,
}: {
  name: CircularIcon;
  px: number;
}) {
  const common = {
    width: px,
    height: px,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false as any,
  };

  switch (name) {
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "qr":
      // Simple QR-ish icon (no deps)
      return (
        <svg {...common} strokeWidth={0} fill="currentColor">
          <path d="M4 4h6v6H4V4Zm2 2v2h2V6H6Zm8-2h6v6h-6V4Zm2 2v2h2V6h-2ZM4 14h6v6H4v-6Zm2 2v2h2v-2H6Zm10-1h2v2h-2v-2Zm-4 0h2v2h-2v-2Zm6 0h2v6h-6v-2h4v-4Zm-6 4h2v2h-2v-2Zm4 0h2v2h-2v-2Z" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg {...common}>
          <path d="M10 6l6 6-6 6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );

    case "settings":
      // Minimal gear icon
      return (
        <svg {...common}>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a7.8 7.8 0 0 0 .1-1 7.8 7.8 0 0 0-.1-1l2-1.6-1.9-3.3-2.4 1a8 8 0 0 0-1.7-1l-.4-2.6H9l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-1.9 3.3 2 1.6a7.8 7.8 0 0 0-.1 1c0 .34.03.67.1 1l-2 1.6 1.9 3.3 2.4-1c.53.4 1.1.73 1.7 1l.4 2.6h6.2l.4-2.6c.6-.27 1.17-.6 1.7-1l2.4 1 1.9-3.3-2-1.6Z" />
        </svg>
      );

    default:
      return null;
  }
}

export default function CircularButton(props: CircularButtonProps) {
  const size = props.size ?? "md";
  const iconPx = ICON_SIZE[size];

  const variant = props.variant ?? "default";
  const variantClasses =
    variant === "inverted"
      ? "bg-foreground text-background border-foreground hover:bg-foreground/90"
      : "bg-background text-foreground border-border hover:bg-foreground/10";

  const classes = [
    "circular-btn",
    SIZE[size],
    variantClasses,
    props.className ?? "",
  ].join(" ");

  const content = <Icon name={props.icon} px={iconPx} />;

  if ("href" in props) {
    // Next Link doesn't support disabled; emulate it.
    if (props.disabled) {
      return (
        <span className={classes} aria-label={props["aria-label"]} title={props.title}>
          {content}
        </span>
      );
    }

    return (
      <Link
        href={props.href}
        className={classes}
        aria-label={props["aria-label"]}
        title={props.title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
      aria-label={props["aria-label"]}
      title={props.title}
    >
      {content}
    </button>
  );
}