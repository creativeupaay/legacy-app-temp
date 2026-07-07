import React from "react";
import { Zap } from "@/components/ui/icons";
import { theme } from "@/theme/theme";

export type CalendarDateVariant = "empty" | "completed" | "streak";

export interface QuickViewCalendarDateProps {
  day?: string; // "Day" label, e.g. weekday abbreviation "M", "T", "W"
  date?: string; // "00" or e.g. "14" — required for empty/completed, unused for streak
  variant: CalendarDateVariant;
  className?: string;
  onClick?: () => void;
}

export const QuickViewCalendarDate: React.FC<QuickViewCalendarDateProps> = ({
  day,
  date,
  variant,
  className = "",
  onClick,
}) => {
  const circleStyle: React.CSSProperties = {
    backgroundColor:
      variant === "completed" || variant === "streak"
        ? theme.colors.primary.motivation
        : "transparent",
  };

  const dayStyle: React.CSSProperties = {
    fontFamily: theme.fonts.sans,
    color: theme.colors.label.muted,
  };

  const zapStyle: React.CSSProperties = {
    color: theme.colors.primary.action,
    fill: theme.colors.primary.action,
  };

  const dateStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
  };

  return (
    <div
      onClick={onClick}
      data-component="Quick view calendar dates"
      data-variant={
        variant === "completed" ? "Completed" : variant === "streak" ? "Variant4" : "Empty"
      }
      className={`flex flex-col items-center justify-center gap-1 shrink-0 ${onClick ? "cursor-pointer hover:opacity-85 active:scale-95 transition-all" : ""} ${className}`.trim()}
    >
      {day && (
        <span
          style={dayStyle}
          className="w-[26px] text-[14px] font-normal leading-none text-center shrink-0"
        >
          {day}
        </span>
      )}
      {/* Note: rounded-[24px] on a 40px box produces a circular squircle per Figma spec */}
      <div
        style={circleStyle}
        className="w-10 h-10 rounded-[24px] flex items-center justify-center transition-colors shrink-0"
      >
        {variant === "streak" ? (
          <Zap
            style={zapStyle}
            className="w-[18px] h-[21px] shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        ) : (
          <span
            style={dateStyle}
            className="font-medium text-[16px] leading-none tracking-[-0.01em]"
          >
            {date}
          </span>
        )}
      </div>
    </div>
  );
};

export default QuickViewCalendarDate;
