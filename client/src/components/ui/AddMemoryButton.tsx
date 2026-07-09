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
      className={`w-[clamp(136px,39.18vw,154px)] h-[clamp(42px,12.21vw,48px)] rounded-[999px] flex items-center justify-center gap-[clamp(8px,2.54vw,10px)] px-[clamp(14px,4.07vw,16px)] py-[clamp(12px,3.81vw,15px)] hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out shrink-0 ${className}`.trim()}
    >
      <Plus
        className="w-[clamp(15px,4.58vw,18px)] h-[clamp(15px,4.58vw,18px)] text-[#000000] shrink-0"
        strokeWidth={2.3}
      />
      <span className="font-['Inter'] font-medium text-[clamp(12px,3.56vw,14px)] leading-none uppercase tracking-[0.05em] text-[#000000] whitespace-nowrap flex items-center justify-center">
        ADD MEMORY
      </span>
    </button>
  );
};

export default AddMemoryButton;
