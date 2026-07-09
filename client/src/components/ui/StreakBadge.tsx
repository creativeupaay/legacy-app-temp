import React from "react";
import { Zap } from "@/components/ui/icons";
import { theme } from "@/theme/theme";

export interface StreakBadgeProps {
  count: number;
  active?: boolean; // false = Default (inactive/gray), true = Variant2 (active/navy)
  onClick?: () => void;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  count,
  active = false,
  onClick,
  className = "",
}) => {
  const badgeStyle: React.CSSProperties = {
    backgroundColor: theme.colors.surface.default,
    borderColor: "rgba(0,0,0,0.04)",
  };

  const activeColor = theme.colors.primary.action;
  const inactiveColor = theme.colors.streak.inactive;

  const iconStyle: React.CSSProperties = {
    color: active ? activeColor : inactiveColor,
    fill: active ? activeColor : "none",
  };

  const textStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    color: active ? activeColor : inactiveColor,
  };

  return (
    <button
      onClick={onClick}
      data-component="Streak"
      data-variant={active ? "Variant2" : "Default"}
      style={badgeStyle}
      className={`inline-flex items-center justify-center gap-[clamp(4px,2vw,8px)] h-[clamp(1.75rem,8.14vw,2rem)] min-w-[clamp(3rem,15vw,3.75rem)] rounded-full px-[clamp(0.5rem,3vw,0.75rem)] border-[0.5px] shadow-[0px_3px_1px_0px_rgba(0,0,0,0.04),0px_3px_8px_0px_rgba(0,0,0,0.12)] transition-colors shrink-0 ${onClick ? "cursor-pointer hover:opacity-90 active:scale-95" : ""} ${className}`.trim()}
    >
      <Zap
        style={iconStyle}
        className="w-[clamp(14px,4.58vw,18px)] h-[clamp(16px,5.34vw,21px)] shrink-0 transition-colors"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span
        style={textStyle}
        className="font-semibold text-[clamp(14px,4.07vw,16px)] leading-none tracking-[-0.01em] transition-colors"
      >
        {count}
      </span>
    </button>
  );
};

export default StreakBadge;
