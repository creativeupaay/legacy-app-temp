import React from "react";
import {
  ChevronLeft,
  X,
  Check,
  SquarePen,
  Mic,
  type LucideIcon,
} from "lucide-react";
import { theme } from "@/theme/theme";

export interface IconButtonProps {
  variant: "back" | "close" | "save" | "write" | "audio";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label": string;
  className?: string;
}

const VARIANT_CONFIG: Record<
  IconButtonProps["variant"],
  {
    icon: LucideIcon;
    iconSize: string;
    strokeWidth?: number;
    style: React.CSSProperties;
    iconStyle: React.CSSProperties;
    className: string;
  }
> = {
  back: {
    icon: ChevronLeft,
    iconSize: "size-6",
    style: {
      backgroundColor: theme.colors.surface.default,
      borderColor: "rgba(0,0,0,0.04)",
    },
    iconStyle: {
      color: theme.colors.text.primary,
    },
    className:
      "border-[0.5px] shadow-[0px_2px_0.75px_rgba(0,0,0,0.12),0px_1px_0.4px_rgba(0,0,0,0.04)]",
  },
  close: {
    icon: X,
    iconSize: "size-6",
    style: {
      backgroundColor: theme.colors.surface.default,
      borderColor: "rgba(0,0,0,0.04)",
    },
    iconStyle: {
      color: theme.colors.text.primary,
    },
    className:
      "border-[0.5px] shadow-[0px_2px_0.75px_rgba(0,0,0,0.12),0px_1px_0.4px_rgba(0,0,0,0.04)]",
  },
  save: {
    icon: Check,
    iconSize: "size-6",
    strokeWidth: 2.2,
    style: {
      backgroundColor: theme.colors.primary.action,
      borderColor: "rgba(0,0,0,0.04)",
    },
    iconStyle: {
      color: theme.colors.text.inverse,
    },
    className:
      "border-[0.5px] shadow-[0px_2px_0.75px_rgba(0,0,0,0.12),0px_1px_0.4px_rgba(0,0,0,0.04)]",
  },
  write: {
    icon: SquarePen,
    iconSize: "size-6",
    strokeWidth: 2.2,
    style: {
      backgroundColor: theme.colors.primary.motivation,
      borderColor: theme.colors.primary.motivationBorder,
    },
    iconStyle: {
      color: theme.colors.text.primary,
    },
    className: "border-[0.5px]",
  },
  audio: {
    icon: Mic,
    iconSize: "size-6",
    style: {
      backgroundColor: theme.colors.primary.motivation,
      borderColor: theme.colors.primary.motivationBorder,
    },
    iconStyle: {
      color: theme.colors.text.primary,
    },
    className: "border-[0.5px]",
  },
};

export const IconButton: React.FC<IconButtonProps> = ({
  variant,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  className,
}) => {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={config.style}
      className={`shrink-0 aspect-square w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-full flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed ${config.className} ${className ?? ""}`}
    >
      <Icon
        style={config.iconStyle}
        className={config.iconSize}
        strokeWidth={config.strokeWidth ?? 2}
      />
    </button>
  );
};

export default IconButton;
