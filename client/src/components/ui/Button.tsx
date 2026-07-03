import React, { useState } from "react";
import { theme } from "@/theme/theme";
import { ArrowRight } from "lucide-react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "disabled";
  icon?: boolean; // trailing Arrow-right — only meaningful on "primary"
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
}

function useHoverStyle() {
  const [isHovered, setIsHovered] = useState(false);
  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  return [isHovered, hoverHandlers] as const;
}

const VARIANT_COLORS: Record<
  "primary" | "secondary" | "disabled",
  { bg: string; hoverBg?: string; color: string }
> = {
  primary: {
    bg: theme.colors.primary.buttonAction,
    hoverBg: theme.hover.buttonAction,
    color: theme.colors.text.inverse,
  },
  secondary: {
    bg: theme.colors.surface.default,
    hoverBg: theme.hover.outline,
    color: theme.colors.text.primary,
  },
  disabled: {
    bg: theme.colors.surface.disabled,
    color: theme.colors.text.disabled,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  icon = false,
  onClick,
  disabled,
  type = "button",
  className,
  children,
}) => {
  const isDisabled = disabled || variant === "disabled";
  const resolvedVariant = isDisabled ? "disabled" : variant;
  const [isHovered, hoverHandlers] = useHoverStyle();
  const { bg, hoverBg, color } = VARIANT_COLORS[resolvedVariant];

  const mergedStyle: React.CSSProperties = {
    backgroundColor: isHovered && hoverBg ? hoverBg : bg,
    color,
    fontFamily: theme.fonts.heading,
    ...(!isDisabled && { outlineColor: color }),
    ...(resolvedVariant === "secondary" && {
      borderWidth: "0.5px",
      borderStyle: "solid",
      borderColor: theme.colors.stroke.subtle,
    }),
  };

  const minWidthClass =
    icon && resolvedVariant === "primary" ? "min-w-[130px]" : "min-w-[96px]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...(!isDisabled ? hoverHandlers : {})}
      style={mergedStyle}
      className={`inline-flex items-center justify-center gap-[10px] h-11 ${minWidthClass} px-5 rounded-full font-medium text-[18px] leading-5 tracking-[0.005em] text-center transition-colors ${
        isDisabled
          ? "cursor-not-allowed"
          : "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
      } ${className ?? ""}`}
    >
      {children}
      {icon && resolvedVariant === "primary" && (
        <ArrowRight className="w-6 h-6 shrink-0" style={{ color: theme.colors.text.inverse }} />
      )}
    </button>
  );
};

export default Button;
