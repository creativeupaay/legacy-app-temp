import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Star, User } from "lucide-react";
import { theme } from "@/theme/theme";

export type NavTab = "home" | "journal" | "memories" | "profile";

export interface NavigationBarProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "home", label: "Home", path: "/home" },
  { id: "journal", label: "Journal", path: "/journal" },
  { id: "memories", label: "Memories", path: "/memories" },
  { id: "profile", label: "Profile", path: "/profile" },
];


const NavIcon: React.FC<{ id: NavTab; isActive: boolean; size?: number }> = ({
  id,
  isActive,
  size = 24,
}) => {
  const activeColor = theme.colors.text.inverse;
  const inactiveColor = theme.colors.text.primary;
  const actionColor = theme.colors.primary.action;

  if (id === "home") {
    if (isActive) {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2 3.8a2.5 2.5 0 0 1 3.6 0l7.2 7.2c.5.5.8 1.2.8 1.9v6.6a2.5 2.5 0 0 1-2.5 2.5H4.7a2.5 2.5 0 0 1-2.5-2.5v-6.6c0-.7.3-1.4.8-1.9l7.2-7.2Z"
            fill={activeColor}
          />
          <path
            d="M9 15c1.5 1.5 4.5 1.5 6 0"
            stroke={actionColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return <Home size={size} style={{ color: inactiveColor }} />;
  }

  if (id === "journal") {
    if (isActive) {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 3.8h5c1.7 0 2.8.9 2.8 2.7v13.7c0-1.7-1.1-2.7-2.8-2.7h-5a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1Z"
            fill={activeColor}
          />
          <path
            d="M20.5 3.8h-5c-1.7 0-2.8.9-2.8 2.7v13.7c0-1.7 1.1-2.7 2.8-2.7h5a1 1 0 0 0 1-1V4.8a1 1 0 0 0-1-1Z"
            fill={activeColor}
          />
        </svg>
      );
    }
    return <BookOpen size={size} style={{ color: inactiveColor }} />;
  }

  if (id === "memories") {
    return (
      <Star
        size={size}
        style={{ color: isActive ? activeColor : inactiveColor }}
        fill={isActive ? activeColor : "none"}
      />
    );
  }

  if (id === "profile") {
    return (
      <User
        size={size}
        style={{ color: isActive ? activeColor : inactiveColor }}
        fill={isActive ? activeColor : "none"}
      />
    );
  }

  return null;
};

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const location = useLocation();

  const getActiveTab = (): NavTab => {
    if (propActiveTab) return propActiveTab;
    if (location.pathname.startsWith("/journal")) return "journal";
    if (location.pathname.startsWith("/memories")) return "memories";
    if (location.pathname.startsWith("/profile")) return "profile";
    return "home"; 
  };

  const currentTab = getActiveTab();

  return (
    <nav
      aria-label="Bottom Navigation"
      style={{
        backgroundColor: theme.colors.surface.nav,
        borderColor: theme.colors.stroke.nav,
      }}
      className="flex items-center justify-between gap-2 h-[6.5vh] min-h-[48px] max-h-[56px] w-[63%] min-w-[220px] max-w-[340px] rounded-full border shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentTab === item.id;

        const content = (
          <span
            style={
              isActive
                ? {
                    backgroundColor: theme.colors.primary.action,
                    color: theme.colors.text.inverse,
                  }
                : {
                    color: theme.colors.text.primary,
                  }
            }
            className={`flex items-center justify-center h-full aspect-square max-w-[56px] max-h-[56px] rounded-full transition-colors ${
              !isActive ? "hover:bg-black/5" : ""
            }`}
          >
            <NavIcon id={item.id} isActive={isActive} size={24} />
          </span>
        );

        if (onTabChange) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{ outlineColor: theme.colors.primary.action }}
              className="h-full aspect-square focus:outline-none focus-visible:ring-2 rounded-full cursor-pointer"
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            to={item.path}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            style={{ outlineColor: theme.colors.primary.action }}
            className="h-full aspect-square focus:outline-none focus-visible:ring-2 rounded-full"
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationBar;
