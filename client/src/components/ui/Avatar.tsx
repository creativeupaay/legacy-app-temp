import React from "react";
import { User } from "lucide-react";
import { theme } from "@/theme/theme";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-[12px]",
  md: "w-10 h-10 text-[14px]",
  lg: "w-12 h-12 text-[16px]",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
  style,
}) => {
  const getInitials = (str?: string) => {
    if (!str) return null;
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.neutral,
        color: theme.colors.text.primary,
        fontFamily: theme.fonts.heading,
        ...style,
      }}
      className={`rounded-full flex items-center justify-center font-semibold overflow-hidden shrink-0 border border-black/5 ${SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {src ? (
        <img src={src} alt={name ?? "Avatar"} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 opacity-60" />
      )}
    </div>
  );
};

export default Avatar;
