"use client";

import Image from "next/image";

type Props = {
  label: string;
  iconSrc: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
};

export default function IconButton({ label, iconSrc, onClick, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full",
        "rounded-xl",
        "border",
        "bg-background",
        "text-foreground",
        "py-2.5",
        "font-semibold",
        "flex",
        "items-center",
        "justify-center",
        "gap-2.5",
        "hover:bg-foreground/5",
        "transition",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
      ].join(" ")}
      aria-label={`Logg inn med ${label}`}
    >
      <Image
        src={iconSrc}
        alt={`${label} logo`}
        width={18}
        height={18}
        className="opacity-90"
      />
      <span>{label}</span>
    </button>
  );
}