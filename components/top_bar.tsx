"use client"; // TODO CHECK IF CAN REMOVE

import React from "react";
import { TopBarProps, TopBarItem } from "@/lib/types/ui_types";

export default function TopBar({
  title,
  subtitle,
  items,
  children,
  className,
}: TopBarProps) {
  const leftItems = (items ?? []).filter((i) => (i.align ?? "left") === "left");
  const rightItems = (items ?? []).filter((i) => i.align === "right");

  return (
    <header
      className={[
        "sticky top-0 z-20 bg-background/80 backdrop-blur border-b",
        className ?? "",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-md px-4 py-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-foreground/70 truncate">{subtitle}</p>
          ) : null}
        </div>

        {/* Preferred API: items */}
        {items && items.length > 0 ? (
          <div className="mt-6 flex items-center gap-3">
            {leftItems.map((i) => (
              <React.Fragment key={i.key}>{i.node}</React.Fragment>
            ))}

            {rightItems.length > 0 ? (
              <div className="ml-auto flex items-center gap-3">
                {rightItems.map((i) => (
                  <React.Fragment key={i.key}>{i.node}</React.Fragment>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Escape hatch API: children */}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}