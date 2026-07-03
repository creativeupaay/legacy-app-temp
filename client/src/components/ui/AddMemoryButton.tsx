import React from "react";
import { Plus } from "@/components/ui/icons";
import { theme } from "@/theme/theme";

export interface AddMemoryButtonProps {
  compact?: boolean; // false/undefined = Default (labeled pill),
                     // true = Variant2 (icon-only circle)
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AddMemoryButton: React.FC<AddMemoryButtonProps> = ({
  compact = false,
  onClick,
  disabled,
  className = "",
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary.motivation,
    color: theme.colors.text.primary,
  };

  const iconStyle: React.CSSProperties = {
    color: theme.colors.text.primary,
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Add memory"
        style={buttonStyle}
        className={`w-[clamp(36px,12.21vw,58px)] h-[clamp(36px,12.21vw,58px)] rounded-full flex items-center justify-center p-[clamp(11px,3.81vw,18px)] pl-[clamp(12px,4.32vw,20px)] pr-[clamp(12px,4.32vw,20px)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0 ${className}`.trim()}
      >
        <Plus
          style={iconStyle}
          className="w-[clamp(14px,4.58vw,22px)] h-[clamp(14px,4.58vw,22px)] shrink-0"
          strokeWidth={2}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      className={`w-[clamp(120px,39.18vw,188px)] h-[clamp(38px,12.21vw,58px)] rounded-full flex items-center justify-center gap-[clamp(6px,2.54vw,12px)] px-[clamp(12px,4.07vw,20px)] py-[clamp(10px,3.81vw,18px)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0 ${className}`.trim()}
    >
      <Plus
        style={iconStyle}
        className="w-[clamp(14px,4.58vw,22px)] h-[clamp(14px,4.58vw,22px)] shrink-0"
        strokeWidth={2}
      />
      {/* UNCONFIRMED: letter-spacing was captured as "50%" in Figma. Using tracking-wide (~0.1em) as a clean visual approximation until verified against Figma Typography panel. */}
      <span
        style={{
          fontFamily: theme.fonts.sans,
          color: theme.colors.text.primary,
        }}
        className="w-[clamp(76px,24.68vw,118px)] h-[clamp(13px,4.32vw,21px)] font-medium text-[clamp(11px,3.56vw,16px)] uppercase tracking-wide leading-[100%] whitespace-nowrap flex items-center justify-center"
      >
        ADD MEMORY
      </span>
    </button>
  );
};

export default AddMemoryButton;
