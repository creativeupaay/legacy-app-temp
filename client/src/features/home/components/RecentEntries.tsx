import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryUICard } from "@/components/ui/MemoryUICard";
import { theme } from "@/theme/theme";
import { useGetJournalEntriesQuery, useGetContactsQuery } from "@/features/journal/api/journalApi";
import { EntryPrivacy } from "@/features/journal/types/journal.types";

export const RecentEntries: React.FC = () => {
  const navigate = useNavigate();
  const { data: journals } = useGetJournalEntriesQuery();
  const { data: contacts = [] } = useGetContactsQuery();

  const recentEntries = useMemo(() => {
    if (!journals) return [];
    return [...journals]
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
      .slice(0, 5);
  }, [journals]);

  const headingStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.secondary,
  };

  const calculateWordCount = (text?: string) => {
    if (!text) return 0;
    let clean = text;
    try {
      const doc = new DOMParser().parseFromString(text, "text/html");
      clean = doc.body.textContent || "";
    } catch {
      clean = text.replace(/<[^>]+>/g, " ");
    }
    return clean
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  };

  return (
    <div className="w-full flex flex-col gap-[8px]">
      <h2 style={headingStyle} className="px-4 sm:px-5 text-[18px] font-medium leading-[100%] tracking-[-0.01em] text-[#6B6B6F] m-0">
        Recent
      </h2>
      
      {/* Horizontal scroll container with hidden scrollbar */}
      <div className="flex items-center gap-[16px] h-[120px] w-full overflow-x-auto overflow-y-hidden px-4 sm:px-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {recentEntries.map(entry => {
          const date = new Date(entry.entryDate);
          const dateMonthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const dateYear = date.getFullYear().toString();
          const entryId = entry.id || entry._id;

          const sharedRecipients = (entry.sharedWith || []).map(item => {
            const found = contacts.find(c => c.id === item || c._id === item || c.email === item);
            if (found) return { name: found.name, avatar: (found as any).avatar, email: found.email };
            return { name: item };
          });

          return (
            <MemoryUICard
              key={entryId}
              variant={entry.privacy === EntryPrivacy.PRIVATE ? "private" : "shared"}
              dateMonthDay={dateMonthDay}
              dateYear={dateYear}
              title={entry.title || "Untitled"}
              bodyText={entry.textBody || ""}
              count={calculateWordCount(entry.textBody)}
              sharedRecipients={sharedRecipients}
              onClick={() => navigate(`/journal/${entryId}`)}
              className="shrink-0"
            />
          );
        })}
        {recentEntries.length === 0 && (
          <div className="text-sm text-gray-500 italic px-2">No recent entries</div>
        )}
        {/* Extra spacing block at the end for scroll padding */}
        <div className="w-1 shrink-0" />
      </div>
    </div>
  );
};

export default RecentEntries;
