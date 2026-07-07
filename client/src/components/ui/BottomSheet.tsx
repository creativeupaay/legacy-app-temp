import React, { useEffect } from "react";
import { theme } from "@/theme/theme";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
  floating?: boolean;
  variant?: "modal" | "floating" | "action-sheet";
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showHandle = true,
  floating = false,
  variant,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const effectiveVariant = variant || (floating ? "floating" : "modal");

  const contentClasses = (() => {
    if (effectiveVariant === "action-sheet") {
      return `relative z-10 w-full max-w-[480px] mx-auto rounded-t-[28px] rounded-b-none mb-0 shadow-[0_-8px_30px_rgba(0,0,0,0.16)] pb-[max(env(safe-area-inset-bottom),10px)] pt-1 px-0 transition-transform animate-in slide-in-from-bottom duration-300 ${className}`.trim();
    }
    if (effectiveVariant === "floating") {
      return `relative z-10 w-[calc(100%-32px)] max-w-[448px] mx-auto rounded-[28px] mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] pb-[max(env(safe-area-inset-bottom),20px)] pt-2 px-0 transition-transform animate-in slide-in-from-bottom duration-300 ${className}`.trim();
    }
    return `relative z-10 w-full max-w-[480px] mx-auto rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 pt-3 pb-8 transition-transform animate-in slide-in-from-bottom duration-300 ${className}`.trim();
  })();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
      />

      <div
        style={{
          backgroundColor: theme.colors.surface.default,
          fontFamily: theme.fonts.sans,
        }}
        className={contentClasses}
      >
        {showHandle && effectiveVariant !== "floating" && effectiveVariant !== "action-sheet" && (
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        )}
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
