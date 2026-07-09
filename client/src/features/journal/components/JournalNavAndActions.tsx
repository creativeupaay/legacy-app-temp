import React from "react";
import { IconButton, AddMemoryButton, BottomSheet } from "@/components/ui";
import { Plus, ChevronRight, Search, X, MoreHorizontal } from "lucide-react";
import { theme } from "@/theme/theme";
import type { IJournalFolder } from "@/features/journal/types/journalFolder.types";


export interface JournalHeaderProps {
  onSearchClick?: () => void;
  onCalendarClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearchOpen?: boolean;
  onSearchToggle?: (isOpen: boolean) => void;
  showFolderActions?: boolean;
  onEditFolder?: () => void;
  onDeleteFolder?: () => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  onSearchClick,
  onCalendarClick,
  searchQuery = "",
  onSearchChange,
  isSearchOpen = false,
  onSearchToggle,
  showFolderActions = false,
  onEditFolder,
  onDeleteFolder,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenSearch = () => {
    onSearchToggle?.(true);
    onSearchClick?.();
  };

  const handleCloseSearch = () => {
    onSearchToggle?.(false);
    onSearchChange?.("");
  };

  const renderRightActions = () => (
    <div className="flex items-center gap-2">
      <IconButton variant="calendar" onClick={onCalendarClick} aria-label="Calendar view" />

      {showFolderActions && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="More options"
            style={{
              backgroundColor: theme.colors.surface.default,
              borderColor: "rgba(0,0,0,0.04)",
            }}
            className="w-10 h-10 rounded-full border-[0.5px] shadow-[0px_2px_0.75px_rgba(0,0,0,0.12),0px_1px_0.4px_rgba(0,0,0,0.04)] flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          >
            <MoreHorizontal
              className="w-5 h-5"
              style={{ color: theme.colors.text.primary }}
            />
          </button>

          {isMenuOpen && (
            <div
              style={{
                backgroundColor: theme.colors.surface.default,
                boxShadow:
                  "0px 8px 32px rgba(0,0,0,0.12), 0px 2px 8px rgba(0,0,0,0.06)",
                fontFamily: theme.fonts.sans,
              }}
              className="absolute right-0 top-[calc(100%+8px)] w-[160px] rounded-[16px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 border border-black/[0.06]"
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEditFolder?.();
                }}
                style={{ color: theme.colors.text.primary }}
                className="w-full text-left px-4 py-3 text-[14px] font-medium hover:bg-black/[0.04] transition-colors cursor-pointer border-b border-black/[0.05]"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDeleteFolder?.();
                }}
                className="w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isSearchOpen) {
    return (
      <div className="flex items-center justify-between w-full mb-5 pt-1 px-[4.35%] animate-in fade-in duration-200">
        <div className="flex items-center flex-1 mr-2 bg-white border border-black/10 rounded-full px-3 h-10 shadow-sm gap-1.5">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            autoFocus
            style={{ fontFamily: theme.fonts.sans }}
            className="w-full bg-transparent text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.("")}
              className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleCloseSearch}
            style={{ fontFamily: theme.fonts.sans, color: theme.colors.primary.action || "#1C274C" }}
            className="text-[12px] font-semibold ml-0.5 px-2 py-0.5 hover:bg-gray-100 rounded-full shrink-0 cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
        {renderRightActions()}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full mb-5 pt-1 px-[4.35%]">
      <IconButton variant="search" onClick={handleOpenSearch} aria-label="Search journals" />
      {renderRightActions()}
    </div>
  );
};

export interface JournalFilterBarProps {
  allCount: number;
  folders?: IJournalFolder[];
  activeFilter?: string | null;
  onFilterChange?: (filterId: string | null) => void;
  onAddNewClick: () => void;
}

export const JournalFilterBar: React.FC<JournalFilterBarProps> = ({
  allCount,
  folders = [],
  activeFilter = null,
  onFilterChange,
  onAddNewClick,
}) => {
  const customFolders = folders.filter((f) => f.id !== null);

  const getChipStyle = (isActive: boolean) => ({
    height: "32px",
    padding: "0 14px",
    gap: "6px",
    borderRadius: "999px",
    borderWidth: isActive ? "1.5px" : "0.8px",
    borderStyle: "solid" as const,
    borderColor: isActive ? "#B3CCD7" : "#E1E1DF",
    backgroundColor: isActive ? "#E3F1F7" : "#FFFFFF",
    boxShadow: isActive ? "none" : "0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
    fontFamily: theme.fonts.sans,
  });

  const isAllActive = activeFilter === null || activeFilter === "all";

  return (
    <div
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex items-center gap-[10px] overflow-x-auto no-scrollbar py-1 mb-2 w-full px-[4.35%]"
    >
      <button
        type="button"
        onClick={onAddNewClick}
        style={{
          height: "32px",
          minWidth: "141.5px",
          padding: "6px 12px",
          gap: "6px",
          borderRadius: "9999px",
          borderWidth: "0.8px",
          borderStyle: "solid",
          borderColor: theme.colors.primary.action || "#1C274C",
          backgroundColor: theme.colors.primary.action || "#1C274C",
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
          color: "#FFFFFF",
          fontFamily: theme.fonts.sans,
        }}
        className="flex items-center justify-center text-[13px] font-semibold hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer select-none"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
        <span>Add new journal</span>
      </button>

      {/* All Entries Chip */}
      <button
        type="button"
        onClick={() => onFilterChange?.(null)}
        style={getChipStyle(isAllActive)}
        className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-pointer hover:opacity-90 transition-all"
      >
        <span
          style={{
            color: isAllActive
              ? theme.colors.primary.action || "#1C274C"
              : theme.colors.text.secondary || "#71717A",
          }}
          className={isAllActive ? "font-semibold" : "font-medium"}
        >
          All Entries
        </span>
        <span
          style={{
            color: isAllActive
              ? theme.colors.primary.action || "#1C274C"
              : theme.colors.text.tertiary || "#A1A1AA",
          }}
          className="font-bold text-[12px]"
        >
          {allCount}
        </span>
      </button>

      {/* Custom Folder Chips */}
      {customFolders.map((folder) => {
        const isActive = activeFilter === folder.id;
        return (
          <button
            key={folder.id}
            type="button"
            onClick={() => onFilterChange?.(folder.id)}
            style={getChipStyle(isActive)}
            className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-pointer hover:opacity-90 transition-all"
          >
            <span
              style={{
                color: isActive
                  ? theme.colors.primary.action || "#1C274C"
                  : theme.colors.text.secondary || "#71717A",
              }}
              className={isActive ? "font-semibold" : "font-medium"}
            >
              {folder.name}
            </span>
            <span
              style={{
                color: isActive
                  ? theme.colors.primary.action || "#1C274C"
                  : theme.colors.text.tertiary || "#A1A1AA",
              }}
              className="font-bold text-[12px]"
            >
              {folder.journalCount}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export interface PrivacySegmentedFilterProps {
  value: "all" | "private" | "shared";
  onChange: (val: "all" | "private" | "shared") => void;
}

export const PrivacySegmentedFilter: React.FC<PrivacySegmentedFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="fixed bottom-[clamp(96px,12vh,110px)] left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto bg-[#E6E7E1] p-[clamp(2px,0.6vw,3px)] rounded-full flex items-center gap-[clamp(2px,0.8vw,4px)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] border border-black/[0.04] max-w-full overflow-x-auto no-scrollbar">
        {(["all", "private", "shared"] as const).map((tab) => {
          const isActive = value === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              style={{ fontFamily: theme.fonts.sans }}
              className={`py-[clamp(4px,1vw,5px)] px-[clamp(10px,3.5vw,18px)] rounded-full text-[clamp(11px,3vw,13px)] font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-white text-[#010102] font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.04)]"
                  : "bg-transparent text-[#71717A] hover:text-[#010102]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export interface FloatingJournalButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const FloatingJournalButton: React.FC<FloatingJournalButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="fixed bottom-[clamp(96px,12vh,110px)] left-0 right-0 z-[45] flex justify-center pointer-events-none">
      <div className="w-full max-w-[480px] flex justify-end pr-[18px] pointer-events-none">
        <div className="pointer-events-auto">
          <AddMemoryButton
            compact={true}
            onClick={onClick}
            className="!w-[clamp(38px,10vw,42px)] !h-[clamp(38px,10vw,42px)] !min-w-[clamp(38px,10vw,42px)] !min-h-[clamp(38px,10vw,42px)] !p-0 shadow-[0px_4px_16px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export interface JournalBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onWriteClick: () => void;
  onRecordClick: () => void;
}

export const JournalBottomSheet: React.FC<JournalBottomSheetProps> = ({
  isOpen,
  onClose,
  onWriteClick,
  onRecordClick,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} variant="action-sheet" showHandle={false}>
      <div className="w-full flex flex-col divide-y divide-[#E1E1DF]/60">
        <div
          onClick={onWriteClick}
          className="flex items-center justify-between w-full px-6 py-[16px] cursor-pointer transition-colors hover:bg-black/[0.04] active:bg-black/[0.08] select-none"
        >
          <span
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="font-semibold text-[16px] tracking-[-0.2px]"
          >
            Write
          </span>
          <ChevronRight className="w-5 h-5 text-[#9CA3AF] stroke-[2] shrink-0" />
        </div>

        <div
          onClick={onRecordClick}
          className="flex items-center justify-between w-full px-6 py-[16px] cursor-pointer transition-colors hover:bg-black/[0.04] active:bg-black/[0.08] select-none"
        >
          <span
            style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
            className="font-semibold text-[16px] tracking-[-0.2px]"
          >
            Record
          </span>
          <ChevronRight className="w-5 h-5 text-[#9CA3AF] stroke-[2] shrink-0" />
        </div>
      </div>
    </BottomSheet>
  );
};


export {
  JournalCalendarWidget,
  JournalInlineCalendarDropdown,
} from "./JournalCalendarComponents";
export type {
  JournalCalendarWidgetProps,
  JournalInlineCalendarDropdownProps,
} from "./JournalCalendarComponents";

