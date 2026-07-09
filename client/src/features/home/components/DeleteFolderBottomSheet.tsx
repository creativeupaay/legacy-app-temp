import React, { useState, useEffect } from "react";
import { theme } from "@/theme/theme";
import type { DeleteFolderAction } from "@/features/journal/types/journalFolder.types";

export interface DeleteFolderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  journalCount: number;
  onConfirmDelete: (action: DeleteFolderAction) => void;
  isDeleting?: boolean;
}

export const DeleteFolderBottomSheet: React.FC<
  DeleteFolderBottomSheetProps
> = ({
  isOpen,
  onClose,
  folderName,
  journalCount,
  onConfirmDelete,
  isDeleting = false,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-5 transition-opacity duration-200 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.40)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: theme.colors.surface.default || "#FFFFFF",
          fontFamily: theme.fonts.sans,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        }}
        className={`w-full max-w-[320px] rounded-[24px] px-4 pt-5 pb-4 transition-all duration-200 ${
          animateIn ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Title */}
        <h2
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary || "#182232" }}
          className="text-[16px] font-bold mb-1 text-center truncate"
        >
          Delete Folder &quot;{folderName}&quot;
        </h2>
        <p
          style={{ color: theme.colors.text.secondary || "#6B6B6F" }}
          className="text-[12px] leading-[1.5] text-center mb-4 px-1"
        >
          {journalCount > 0
            ? `This folder contains ${journalCount} ${
                journalCount === 1 ? "entry" : "entries"
              }. Choose what to do:`
            : "Are you sure you want to delete this empty folder?"}
        </p>

        {journalCount > 0 ? (
          <>
            {/* Option 1 – Keep Entries in All Entries */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onConfirmDelete("move_to_all_entries")}
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                fontFamily: theme.fonts.sans,
                color: theme.colors.text.primary || "#182232",
              }}
              className="group w-full text-left px-3.5 py-3 mb-2 rounded-[14px] border bg-[#F7F7F8] hover:bg-white hover:border-black/15 hover:shadow-sm active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer"
            >
              <p
                style={{ fontFamily: theme.fonts.heading }}
                className="font-semibold text-[13.5px] mb-0.5"
              >
                Move to All Entries
              </p>
              <p
                style={{ color: theme.colors.text.secondary || "#6B6B6F" }}
                className="text-[11.5px] leading-[1.4]"
              >
                Deletes folder and keeps entries in All Entries.
              </p>
            </button>

            {/* Option 2 – Delete Folder & Entries Inside */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onConfirmDelete("delete_all")}
              style={{
                backgroundColor: theme.colors.primary.action || "#1C274C",
                fontFamily: theme.fonts.sans,
              }}
              className="w-full text-left px-3.5 py-3 rounded-[14px] hover:opacity-90 hover:shadow-md active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer"
            >
              <p
                style={{ color: "#FFFFFF", fontFamily: theme.fonts.heading }}
                className="font-semibold text-[13.5px] mb-0.5"
              >
                {isDeleting ? "Deleting…" : "Delete Folder & Entries"}
              </p>
              <p
                style={{ color: "rgba(255,255,255,0.68)" }}
                className="text-[11.5px] leading-[1.4]"
              >
                Permanently removes folder and entries inside.
              </p>
            </button>
          </>
        ) : (
          /* Empty Folder Option */
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirmDelete("delete_all")}
            style={{
              backgroundColor: theme.colors.primary.action || "#1C274C",
              fontFamily: theme.fonts.sans,
            }}
            className="w-full text-left px-3.5 py-3 rounded-[14px] hover:opacity-90 hover:shadow-md active:scale-[0.98] transition-all duration-150 disabled:opacity-60 cursor-pointer"
          >
            <p
              style={{ color: "#FFFFFF", fontFamily: theme.fonts.heading }}
              className="font-semibold text-[13.5px] mb-0.5"
            >
              {isDeleting ? "Deleting…" : "Delete Folder"}
            </p>
            <p
              style={{ color: "rgba(255,255,255,0.68)" }}
              className="text-[11.5px] leading-[1.4]"
            >
              Permanently remove this empty folder.
            </p>
          </button>
        )}
      </div>
    </div>
  );
};
