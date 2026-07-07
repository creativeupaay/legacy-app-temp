import React from "react";
import { theme } from "@/theme/theme";

export interface ChipProps {
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "active";
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

  const chipStyle: React.CSSProperties = {
    backgroundColor: isPrimary
      ? theme.colors.primary.buttonAction
      : isActive
      ? theme.colors.surface.default
      : theme.colors.surface.neutral,
    color: isPrimary ? theme.colors.text.inverse : theme.colors.text.primary,
    fontFamily: theme.fonts.sans,
    borderWidth: isPrimary ? "0px" : "1px",
    borderStyle: "solid",
    borderColor: isPrimary
      ? "transparent"
      : isActive
      ? theme.colors.stroke.border
      : "transparent",
    boxShadow: isActive ? "0px 1px 2px rgba(0, 0, 0, 0.05)" : "none",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={chipStyle}
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium leading-none whitespace-nowrap transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer shrink-0 ${className}`.trim()}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{label}</span>
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
