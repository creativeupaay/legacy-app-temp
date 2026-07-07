import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useGetJournalEntriesQuery,
} from "@/features/journal/api/journalApi";
import {
  setIsBottomSheetOpen,
  resetDraft,
} from "@/features/journal/slice/journalSlice";
import { EntryPrivacy } from "@/features/journal/types/journal.types";
import {
  JournalHeader,
  JournalFilterBar,
  JournalTimeline,
  PrivacySegmentedFilter,
  FloatingJournalButton,
  JournalBottomSheet,
  JournalEmptyState,
  JournalLoadingState,
  JournalInlineCalendarDropdown,
} from "@/features/journal/components";

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
};

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isBottomSheetOpen } = useAppSelector(
    (state) => state.journal
  );

  const [privacyFilter, setPrivacyFilter] = React.useState<"all" | "private" | "shared">("all");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCalendarMounted, setIsCalendarMounted] = React.useState(false);
  const [isCalendarAnimating, setIsCalendarAnimating] = React.useState(false);
  const [selectedDateStr, setSelectedDateStr] = React.useState<string | null>(null);

  const { data: entries = [], isLoading } = useGetJournalEntriesQuery();

  const allCount = entries.length;
  // Dummy counts for folder chips (to be replaced with actual folder counts from home page later)
  const memoriesCount = 1;
  const dailyNotesCount = 2;
  const travelCount = 2;

  const displayedEntries = React.useMemo(() => {
    return entries.filter((e) => {
      // 1. Privacy filter ("all", "private", "shared")
      if (privacyFilter === "private") {
        const isPrivate =
          !e.privacy || e.privacy === EntryPrivacy.PRIVATE;
        if (!isPrivate) return false;
      } else if (privacyFilter === "shared") {
        const isShared =
          e.privacy === EntryPrivacy.SHARED_SPECIFIC ||
          e.privacy === EntryPrivacy.SHARED_ALL;
        if (!isShared) return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const titleMatch = (e.title || "").toLowerCase().includes(q);
        const bodyMatch = stripHtml(e.textBody || "").toLowerCase().includes(q);
        if (!titleMatch && !bodyMatch) return false;
      }

      // 3. Date filter from calendar
      if (selectedDateStr) {
        const d = new Date(e.entryDate || e.createdAt);
        if (isNaN(d.getTime()) || d.toDateString() !== selectedDateStr) {
          return false;
        }
      }

      return true;
    });
  }, [entries, privacyFilter, searchQuery, selectedDateStr]);

  const handleOpenBottomSheet = () => {
    dispatch(setIsBottomSheetOpen(true));
  };

  const handleCloseBottomSheet = () => {
    dispatch(setIsBottomSheetOpen(false));
  };

  const handleWriteClick = () => {
    dispatch(setIsBottomSheetOpen(false));
    dispatch(resetDraft());
    navigate("/journal/write");
  };

  const handleRecordClick = () => {
    dispatch(setIsBottomSheetOpen(false));
    alert("Audio recording feature is coming soon!");
  };

  const handleEntryClick = (entryId: string) => {
    navigate(`/journal/${entryId}`);
  };

  const handleOpenCalendar = () => {
    setIsCalendarMounted(true);
    setTimeout(() => {
      setIsCalendarAnimating(true);
    }, 10);
  };

  const handleCloseCalendar = () => {
    setIsCalendarAnimating(false);
    setTimeout(() => {
      setIsCalendarMounted(false);
    }, 220);
  };

  const handleToggleCalendar = () => {
    if (isCalendarMounted) {
      handleCloseCalendar();
    } else {
      handleOpenCalendar();
    }
  };

  const handleApplyCalendar = (dateStr: string | null) => {
    setIsCalendarAnimating(false);
    setSelectedDateStr(dateStr);
    setTimeout(() => {
      setIsCalendarMounted(false);
    }, 220);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-full relative pb-44">
      {/* ── Sticky Header: search bar + filter chips stay pinned on scroll ── */}
      <div
        style={{
          backgroundColor: "#F2F3EE",
          boxShadow: "0 4px 16px rgba(0,0,0,0.0)",
        }}
        className="sticky top-0 z-20 transition-shadow duration-200"
        id="journal-sticky-header"
      >
        {/* Header */}
        <JournalHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearchOpen={isSearchOpen}
          onSearchToggle={setIsSearchOpen}
          onSearchClick={() => setIsSearchOpen(true)}
          onCalendarClick={handleToggleCalendar}
        />

        {/* Filter Bar */}
        <JournalFilterBar
          allCount={allCount}
          memoriesCount={memoriesCount}
          dailyNotesCount={dailyNotesCount}
          travelCount={travelCount}
          onAddNewClick={handleOpenBottomSheet}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative pt-5">
        {/* Continuous Timeline Line rendered once by the Journal page */}
        {!isLoading && displayedEntries.length > 0 && (
          <div
            style={{ backgroundColor: "#E1E1DF" }}
            className="absolute top-0 bottom-[40px] left-[21.5px] w-[1.5px] z-0 pointer-events-none"
          />
        )}
        {isLoading ? (
          <JournalLoadingState />
        ) : displayedEntries.length === 0 ? (
          selectedDateStr ? (
            <div className="py-16 px-4 text-center">
              <p className="text-[15px] font-semibold text-gray-700 mb-1">
                No entries for this date
              </p>
              <p className="text-[13px] text-gray-500 mb-4">
                No journal entries were found for {selectedDateStr}.
              </p>
              <button
                type="button"
                onClick={() => setSelectedDateStr(null)}
                className="text-[13px] font-semibold text-[#1C274C] underline cursor-pointer"
              >
                Show all entries
              </button>
            </div>
          ) : searchQuery.trim() ? (
            <div className="py-16 px-4 text-center">
              <p className="text-[15px] font-semibold text-gray-700 mb-1">
                No results found
              </p>
              <p className="text-[13px] text-gray-500">
                No journal entries match "{searchQuery}". Try searching for something else.
              </p>
            </div>
          ) : (
            <JournalEmptyState onAddClick={handleOpenBottomSheet} />
          )
        ) : (
          <JournalTimeline
            entries={displayedEntries}
            onEntryClick={handleEntryClick}
          />
        )}
      </div>

      {/* ── Bottom Blur Overlay: smoothly blurs entries scrolling behind the navbar and filter pills ── */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[170px] z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(242, 243, 238, 0) 0%, rgba(242, 243, 238, 0.75) 45%, rgba(242, 243, 238, 0.95) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
        }}
      />

      {/* Privacy Segmented Control Filter */}
      <PrivacySegmentedFilter
        value={privacyFilter}
        onChange={setPrivacyFilter}
      />

      {/* Floating Action Button */}
      <FloatingJournalButton
        onClick={isBottomSheetOpen ? handleCloseBottomSheet : handleOpenBottomSheet}
        isOpen={isBottomSheetOpen}
      />

      {/* Bottom Action Sheet */}
      <JournalBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onWriteClick={handleWriteClick}
        onRecordClick={handleRecordClick}
      />

      {/* Backdrop overlay for background blur when calendar dropdown is open */}
      {isCalendarMounted && (
        <div
          onClick={handleCloseCalendar}
          style={{
            backdropFilter: isCalendarAnimating ? "blur(6px)" : "blur(0px)",
            WebkitBackdropFilter: isCalendarAnimating ? "blur(6px)" : "blur(0px)",
            backgroundColor: isCalendarAnimating
              ? "rgba(242, 243, 238, 0.45)"
              : "rgba(242, 243, 238, 0)",
          }}
          className="fixed inset-0 z-50 transition-all duration-220 ease-in-out"
        />
      )}

      {/* Floating Calendar Dropdown Container */}
      {isCalendarMounted && (
        <div className="fixed top-[48px] left-0 right-0 z-[55] flex justify-center pointer-events-none">
          <div className="w-full max-w-[480px] flex justify-start pl-4 sm:pl-6 pointer-events-none">
            <div
              style={{
                opacity: isCalendarAnimating ? 1 : 0,
                transform: isCalendarAnimating ? "scale(1)" : "scale(0.95)",
                transformOrigin: "top left",
              }}
              className="pointer-events-auto w-[min(380px,90vw)] max-w-[calc(100vw-32px)] transition-all duration-220 ease-out"
            >
              <JournalInlineCalendarDropdown
                selectedDateStr={selectedDateStr}
                onApply={handleApplyCalendar}
                onClose={handleCloseCalendar}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
