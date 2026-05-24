interface UserBadgeProps {
  userId: string;
  displayName: string;
  color: string;
  size?: "sm" | "md";
}

export function UserBadge({ userId, displayName, color, size = "md" }: UserBadgeProps) {
  const bg = color + "26";
  return (
    <span
      className={[
        "inline-block label-mono rounded-sm",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
      ].join(" ")}
      style={{ backgroundColor: bg, color }}
    >
      {displayName}
    </span>
  );
}
