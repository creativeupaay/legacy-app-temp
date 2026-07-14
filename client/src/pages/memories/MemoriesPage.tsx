import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "@/theme/theme";
import { useGetMemoriesQuery } from "@/features/journal/api/journalApi";
import {
  JournalHeader,
  JournalTimeline,
  JournalLoadingState,
  JournalInlineCalendarDropdown,
} from "@/features/journal/components";
import { Star } from "lucide-react";

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

const MemoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalendarMounted, setIsCalendarMounted] = useState(false);
  const [isCalendarAnimating, setIsCalendarAnimating] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const { data: memories = [], isLoading } = useGetMemoriesQuery();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute unique authors for filter chips
  const uniqueAuthors = useMemo(() => {
    const map = new Map<string, { id: string; fullName: string; email: string; avatar: string | null; relationship?: string }>();
    for (const m of memories) {
      if (m.author && m.author.email) {
        const authorId = m.author.id || m.ownerId || m.author.email;
        if (!map.has(authorId)) {
          map.set(authorId, {
            id: authorId,
            fullName: m.author.fullName,
            email: m.author.email,
            avatar: m.author.avatar ?? null,
            relationship: m.author.relationship,
          });
        }
      }
    }
    return Array.from(map.values());
  }, [memories]);

  const displayedMemories = useMemo(() => {
    return memories.filter((e) => {
      // 1. Author Filter
      if (selectedAuthorId !== null) {
        const authorId = e.author?.id || e.ownerId || e.author?.email;
        if (authorId !== selectedAuthorId) return false;
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
  }, [memories, selectedAuthorId, searchQuery, selectedDateStr]);

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
    <div className="w-full max-w-[480px] mx-auto flex flex-col min-h-screen relative pb-44">
      {/* Sticky Header */}
      <div
        style={{
          backgroundColor: theme.colors.surface.mainBg,
          paddingTop: "4%",
          marginLeft: "-4%",
          marginRight: "-4%",
        }}
        className="sticky top-0 z-20 transition-shadow duration-200"
        id="memories-sticky-header"
      >
        <JournalHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSearchOpen={isSearchOpen}
          onSearchToggle={setIsSearchOpen}
          onSearchClick={() => setIsSearchOpen(true)}
          onCalendarClick={handleToggleCalendar}
          showFolderActions={false}
        />

        {/* Scrollable Author Filter Bar */}
        {uniqueAuthors.length > 0 && (
          <div className="w-full overflow-x-auto no-scrollbar flex gap-2 px-4 py-3 shrink-0">
            <button
              onClick={() => setSelectedAuthorId(null)}
              style={{
                backgroundColor: selectedAuthorId === null ? theme.colors.primary.action : "#FFFFFF",
                color: selectedAuthorId === null ? "#FFFFFF" : theme.colors.text.primary,
                borderColor: selectedAuthorId === null ? theme.colors.primary.action : "rgba(0,0,0,0.06)",
                fontFamily: theme.fonts.sans,
              }}
              className="px-4 py-1.5 text-[12px] font-semibold rounded-full border shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              All Memories ({memories.length})
            </button>
            {uniqueAuthors.map((author) => {
              const isSelected = selectedAuthorId === author.id;
              const authorCount = memories.filter((m) => {
                const authorId = m.author?.id || m.ownerId || m.author?.email;
                return authorId === author.id;
              }).length;
              const displayName = author.fullName.trim() || author.email;
              return (
                <button
                  key={author.id}
                  onClick={() => setSelectedAuthorId(author.id)}
                  style={{
                    backgroundColor: isSelected ? theme.colors.primary.action : "#FFFFFF",
                    color: isSelected ? "#FFFFFF" : theme.colors.text.primary,
                    borderColor: isSelected ? theme.colors.primary.action : "rgba(0,0,0,0.06)",
                    fontFamily: theme.fonts.sans,
                  }}
                  className="px-4 py-1.5 text-[12px] font-semibold rounded-full border shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                >
                  {author.avatar && (
                    <img src={author.avatar} alt={displayName} className="w-4.5 h-4.5 rounded-full object-cover" />
                  )}
                  <span>
                    {displayName} {author.relationship ? `(${author.relationship})` : ""} ({authorCount})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative pt-5">
        {!isLoading && displayedMemories.length > 0 && (
          <div
            style={{ backgroundColor: "#E1E1DF" }}
            className="absolute top-0 bottom-[40px] left-[21.5px] w-[1.5px] z-0 pointer-events-none"
          />
        )}
        {isLoading ? (
          <JournalLoadingState />
        ) : displayedMemories.length === 0 ? (
          selectedDateStr ? (
            <div className="py-16 px-4 text-center">
              <p className="text-[15px] font-semibold text-gray-700 mb-1">
                No memories for this date
              </p>
              <p className="text-[13px] text-gray-500 mb-4">
                No shared legacy entries were found for {selectedDateStr}.
              </p>
              <button
                type="button"
                onClick={() => setSelectedDateStr(null)}
                className="text-[13px] font-semibold text-[#1C274C] underline cursor-pointer"
              >
                Show all memories
              </button>
            </div>
          ) : searchQuery.trim() ? (
            <div className="py-16 px-4 text-center">
              <p className="text-[15px] font-semibold text-gray-700 mb-1">
                No results found
              </p>
              <p className="text-[13px] text-gray-500">
                No legacy memories match "{searchQuery}". Try searching for something else.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center w-full my-auto">
              <div
                style={{
                  backgroundColor: "#E2F1F8",
                  borderColor: "#B5D6E6",
                }}
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border shadow-sm"
              >
                <Star className="w-8 h-8 text-[#1C274C]" strokeWidth={1.8} fill="#1C274C" />
              </div>
              <h3
                style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
                className="text-[20px] font-bold mb-1"
              >
                No Legacy Memories Yet
              </h3>
              <p
                style={{ fontFamily: theme.fonts.sans, color: theme.colors.text.secondary }}
                className="text-[14px] max-w-[280px] leading-relaxed"
              >
                Once a contact who shared journals with you becomes inactive, their memories will appear here.
              </p>
            </div>
          )
        ) : (
          <JournalTimeline
            entries={displayedMemories}
            onEntryClick={handleEntryClick}
          />
        )}
      </div>

      {/* Bottom Blur Overlay */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-[480px] h-[140px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(242, 243, 238, 0) 0%, rgba(242, 243, 238, 0.4) 55%, rgba(242, 243, 238, 0.88) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
          }}
        />
      </div>

      {/* Calendar Dropdown */}
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

export default MemoriesPage;
