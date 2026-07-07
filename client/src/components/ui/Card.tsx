import React from "react";
import { theme } from "@/theme/theme";

export interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "active" | "neutral";
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  onClick,
  className = "",
  style,
}) => {
  const getBgColor = () => {
    if (variant === "active") return "#EBF7FF"; // Light blue selection active state per Figma Image 3/4
    if (variant === "elevated") return theme.colors.surface.elevated;
    if (variant === "neutral") return theme.colors.surface.neutral;
    return theme.colors.surface.default;
  };

  const getBorderColor = () => {
    if (variant === "active") return "#B3CCD7"; // theme.colors.stroke.blue
    return "rgba(0, 0, 0, 0.04)";
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: getBgColor(),
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: getBorderColor(),
    boxShadow:
      variant === "elevated"
        ? "0px 4px 12px rgba(0, 0, 0, 0.05)"
        : "0px 1px 3px rgba(0, 0, 0, 0.03)",
    ...style,
  };

  return (
    <div
      onClick={onClick}
      style={cardStyle}
      className={`rounded-[16px] p-4 transition-all ${
        onClick ? "cursor-pointer hover:shadow-md active:scale-[0.99]" : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default Card;
