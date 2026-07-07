import React from "react";
import { IconButton, AddMemoryButton, BottomSheet } from "@/components/ui";
import { Plus, ChevronRight, Search, X } from "lucide-react";
import { theme } from "@/theme/theme";


export interface JournalHeaderProps {
  onSearchClick?: () => void;
  onCalendarClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearchOpen?: boolean;
  onSearchToggle?: (isOpen: boolean) => void;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  onSearchClick,
  onCalendarClick,
  searchQuery = "",
  onSearchChange,
  isSearchOpen = false,
  onSearchToggle,
}) => {
  const handleOpenSearch = () => {
    onSearchToggle?.(true);
    onSearchClick?.();
  };

  const handleCloseSearch = () => {
    onSearchToggle?.(false);
    onSearchChange?.("");
  };

  if (isSearchOpen) {
    return (
      <div className="flex items-center justify-between w-full mb-5 pt-1 animate-in fade-in duration-200">
        <div className="flex items-center w-[65%] bg-white border border-black/10 rounded-full px-3 h-10 shadow-sm gap-1.5">
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
        <IconButton variant="calendar" onClick={onCalendarClick} aria-label="Calendar view" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full mb-5 pt-1">
      <IconButton variant="search" onClick={handleOpenSearch} aria-label="Search journals" />
      <IconButton variant="calendar" onClick={onCalendarClick} aria-label="Calendar view" />
    </div>
  );
};

export interface JournalFilterBarProps {
  allCount: number;
  memoriesCount: number;
  dailyNotesCount?: number;
  travelCount?: number;
  activeFilter?: "all" | "memories";
  onFilterChange?: (filter: "all" | "memories") => void;
  onAddNewClick: () => void;
}

export const JournalFilterBar: React.FC<JournalFilterBarProps> = ({
  allCount,
  memoriesCount = 1,
  dailyNotesCount = 2,
  travelCount = 2,
  onAddNewClick,
}) => {
  return (
    <div
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className="flex items-center gap-[10px] overflow-x-auto no-scrollbar py-1 mb-2 w-full"
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

      <div
        style={{
          height: "32px",
          minWidth: "103.6px",
          padding: "0 14px",
          gap: "4px",
          borderRadius: "999px",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: "#B3CCD7",
          backgroundColor: "#E3F1F7",
          fontFamily: theme.fonts.sans,
        }}
        className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-default"
      >
        <span style={{ color: theme.colors.primary.action || "#1C274C" }} className="font-semibold">
          All Entries
        </span>
        <span style={{ color: theme.colors.primary.action || "#1C274C" }} className="font-bold text-[12px]">
          {allCount}
        </span>
      </div>

      <div
        style={{
          height: "32px",
          minWidth: "99.6px",
          padding: "6px 12px",
          gap: "6px",
          borderRadius: "9999px",
          borderWidth: "0.8px",
          borderStyle: "solid",
          borderColor: "#E1E1DF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
          fontFamily: theme.fonts.sans,
        }}
        className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-default"
      >
        <span style={{ color: theme.colors.text.secondary || "#71717A" }} className="font-medium">
          Memories
        </span>
        <span style={{ color: theme.colors.text.tertiary || "#A1A1AA" }} className="font-bold text-[12px]">
          {memoriesCount}
        </span>
      </div>

      <div
        style={{
          height: "32px",
          minWidth: "99.6px",
          padding: "6px 12px",
          gap: "6px",
          borderRadius: "9999px",
          borderWidth: "0.8px",
          borderStyle: "solid",
          borderColor: "#E1E1DF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
          fontFamily: theme.fonts.sans,
        }}
        className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-default"
      >
        <span style={{ color: theme.colors.text.secondary || "#71717A" }} className="font-medium">
          Daily Notes
        </span>
        <span style={{ color: theme.colors.text.tertiary || "#A1A1AA" }} className="font-bold text-[12px]">
          {dailyNotesCount}
        </span>
      </div>

      <div
        style={{
          height: "32px",
          minWidth: "99.6px",
          padding: "6px 12px",
          gap: "6px",
          borderRadius: "9999px",
          borderWidth: "0.8px",
          borderStyle: "solid",
          borderColor: "#E1E1DF",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.05)",
          fontFamily: theme.fonts.sans,
        }}
        className="flex items-center justify-center text-[13px] shrink-0 select-none cursor-default"
      >
        <span style={{ color: theme.colors.text.secondary || "#71717A" }} className="font-medium">
          Travel
        </span>
        <span style={{ color: theme.colors.text.tertiary || "#A1A1AA" }} className="font-bold text-[12px]">
          {travelCount}
        </span>
      </div>
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
    <div className="fixed bottom-[108px] left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#E6E7E1] p-[3px] rounded-full flex items-center gap-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] border border-black/[0.04]">
        {(["all", "private", "shared"] as const).map((tab) => {
          const isActive = value === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              style={{ fontFamily: theme.fonts.sans }}
              className={`py-[5px] px-[18px] rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer select-none ${
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
    <div className="fixed bottom-[108px] left-0 right-0 z-30 flex justify-center pointer-events-none">
      <div className="w-full max-w-[480px] flex justify-end px-[4%] pointer-events-none">
        <div className="pointer-events-auto">
          <AddMemoryButton
            compact={true}
            onClick={onClick}
            className="!w-[42px] !h-[42px] !min-w-[42px] !min-h-[42px] !p-0 shadow-[0px_4px_16px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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

