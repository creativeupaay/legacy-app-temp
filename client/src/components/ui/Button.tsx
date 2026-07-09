import React, { useState } from "react";
import { theme } from "@/theme/theme";
import { ArrowRight } from "lucide-react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "disabled" | "edit";
  icon?: boolean; // trailing Arrow-right — only meaningful on "primary"
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
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
  "primary" | "secondary" | "disabled" | "edit",
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
  edit: {
    bg: theme.colors.surface.editButton || "#D1D1D6",
    hoverBg: theme.hover.editButton || "#C5C5CA",
    color: theme.colors.text.secondary,
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  icon = false,
  onClick,
  disabled,
  type = "button",
  className,
  style: customStyle,
  children,
}) => {
  const isDisabled = disabled || variant === "disabled";
  const resolvedVariant = isDisabled ? "disabled" : variant;
  const [isHovered, hoverHandlers] = useHoverStyle();
  const { bg, hoverBg, color } = VARIANT_COLORS[resolvedVariant];

  const cleanedCustomStyle: React.CSSProperties = customStyle
    ? Object.fromEntries(
        Object.entries(customStyle).filter(([_, v]) => v !== undefined)
      )
    : {};

  const mergedStyle: React.CSSProperties = {
    backgroundColor: isHovered && hoverBg ? hoverBg : bg,
    color,
    fontFamily: resolvedVariant === "edit" ? theme.fonts.sans : theme.fonts.heading,
    ...(!isDisabled && { outlineColor: color }),
    ...(resolvedVariant === "secondary" && {
      borderWidth: "0.5px",
      borderStyle: "solid",
      borderColor: theme.colors.stroke.subtle,
    }),
    ...(resolvedVariant === "edit" && {
      borderTop: "1.6px solid #FFFFFF",
      whiteSpace: "nowrap",
      width: "max-content",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      height: "28px",
      paddingLeft: "8px",
      paddingRight: "6px",
      borderRadius: "999px",
    }),
    ...cleanedCustomStyle,
  };

  const minWidthClass =
    resolvedVariant === "edit"
      ? "min-w-0"
      : icon && resolvedVariant === "primary"
      ? "min-w-[130px]"
      : "min-w-[96px]";

  const sizeClasses =
    resolvedVariant === "edit"
      ? "rounded-full font-medium text-[10px] leading-[21px] tracking-[-0.14px] shrink-0"
      : "h-11 px-5 rounded-full font-medium text-[18px] leading-5 tracking-[0.005em] gap-[10px]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...(!isDisabled ? hoverHandlers : {})}
      style={mergedStyle}
      className={`inline-flex items-center justify-center ${sizeClasses} ${minWidthClass} text-center transition-colors ${
        isDisabled
          ? "cursor-not-allowed"
          : "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
      } ${className ?? ""}`.trim()}
    >
      {children}
      {icon && resolvedVariant === "primary" && (
        <ArrowRight className="w-6 h-6 shrink-0" style={{ color: theme.colors.text.inverse }} />
      )}
    </button>
  );
};

export default Button;
