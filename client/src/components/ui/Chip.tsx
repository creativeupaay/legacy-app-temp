import React from "react";
import { theme } from "@/theme/theme";

export interface ChipProps {
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "active" | "compact";
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  icon,
  variant = "secondary",
  onClick,
  className = "",
}) => {
  const isPrimary = variant === "primary";
  const isActive = variant === "active";
  const isCompact = variant === "compact";

  const chipStyle: React.CSSProperties = {
    backgroundColor: isPrimary
      ? theme.colors.primary.buttonAction
      : isActive
      ? theme.colors.surface.default
      : isCompact
      ? theme.colors.surface.base
      : theme.colors.surface.neutral,
    color: isPrimary
      ? theme.colors.text.inverse
      : isCompact
      ? theme.colors.text.secondary
      : theme.colors.text.primary,
    fontFamily: theme.fonts.sans,
    borderWidth: isPrimary || isCompact ? "0px" : "1px",
    borderStyle: "solid",
    borderColor: isPrimary
      ? "transparent"
      : isActive
      ? theme.colors.stroke.border
      : "transparent",
    boxShadow: isActive ? "0px 1px 2px rgba(0, 0, 0, 0.05)" : "none",
    ...(isCompact && {
      minHeight: "clamp(15px, 2vw, 18px)",
      padding: "clamp(1px, 0.3vw, 2px) clamp(6px, 1.8vw, 9px)",
      fontSize: "clamp(8px, 1.6vw, 9.5px)",
      fontWeight: 600,
      letterSpacing: "0.3px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "999px",
      maxWidth: "100%",
    }),
  };

  const sizeClasses = isCompact
    ? "leading-none max-w-full truncate"
    : "px-3.5 py-1.5 text-[13px] font-medium leading-none whitespace-nowrap shrink-0";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick && isCompact}
      style={chipStyle}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all ${sizeClasses} ${
        onClick ? "hover:opacity-90 active:scale-[0.98] cursor-pointer" : "cursor-default"
      } ${className}`.trim()}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className={isCompact ? "truncate max-w-full" : ""}>{label}</span>
      {count !== undefined && (
        <span
          style={{
            color: isPrimary
              ? "rgba(255, 255, 255, 0.7)"
              : theme.colors.text.secondary,
          }}
          className="text-[12px] ml-0.5"
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Chip;
