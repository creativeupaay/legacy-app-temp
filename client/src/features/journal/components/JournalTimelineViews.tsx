import React from "react";
import { JournalEntryCard, type JournalEntryCardProps } from "@/components/ui";
import { SquarePen } from "lucide-react";
import { theme } from "@/theme/theme";
import type { IJournalEntry } from "../types/journal.types";

export type JournalCardProps = JournalEntryCardProps;

export const JournalCard: React.FC<JournalCardProps> = (props) => {
  return <JournalEntryCard {...props} />;
};

export interface JournalTimelineProps {
  entries: IJournalEntry[];
  onEntryClick: (id: string) => void;
}

export const JournalTimeline: React.FC<JournalTimelineProps> = ({
  entries,
  onEntryClick,
}) => {
  const formatDate = (dateVal: string | Date) => {
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) {
        return { day: "--", month: "---" };
      }
      const day = d.getDate().toString().padStart(2, "0");
      const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
      return { day, month };
    } catch {
      return { day: "--", month: "---" };
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-10">
      {entries.map((entry, index) => {
        const entryId = entry.id || entry._id || `entry-${index}`;
        const { day, month } = formatDate(entry.entryDate || entry.createdAt);

        return (
          <div key={entryId} className="flex items-start w-full relative mb-8 group">
            <div className="w-[44px] shrink-0 flex flex-col items-center relative pt-3">
              <div
                style={{
                  fontFamily: theme.fonts.heading,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
                className="flex flex-col items-center justify-center z-10 py-1.5 px-1 rounded-[8px] min-w-[38px]"
              >
                <span
                  style={{ color: theme.colors.text.primary }}
                  className="text-[15px] font-bold leading-none tracking-tight"
                >
                  {day}
                </span>
                <span
                  style={{ color: theme.colors.text.secondary }}
                  className="text-[10px] font-bold tracking-wider mt-[3px]"
                >
                  {month}
                </span>
              </div>
            </div>

            <div className="flex-1 pl-4 min-w-0">
              <JournalCard
                entryId={entryId}
                heading={entry.title}
                type="written"
                bodyText={entry.textBody}
                onClick={() => onEntryClick(entryId)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface JournalEmptyStateProps {
  onAddClick: () => void;
}

export const JournalEmptyState: React.FC<JournalEmptyStateProps> = ({
  onAddClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center w-full my-auto">
      <div
        style={{
          backgroundColor: theme.colors.primary.motivation,
          borderColor: theme.colors.primary.motivationBorder,
        }}
        onClick={onAddClick}
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border shadow-sm cursor-pointer hover:scale-105 transition-transform"
      >
        <SquarePen className="w-8 h-8 text-black" strokeWidth={1.8} />
      </div>
      <h3
        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
        className="text-[20px] font-bold mb-1"
      >
        No Journal Entries Yet
      </h3>
      <p
        style={{ fontFamily: theme.fonts.sans, color: theme.colors.text.secondary }}
        className="text-[14px] max-w-[260px] leading-relaxed mb-2"
      >
        Tap the button below or top right to write down your story or capture a moment.
      </p>
    </div>
  );
};
export const JournalLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-5 animate-pulse pb-10 relative">
      <div className="absolute top-0 bottom-[40px] left-[21.5px] w-[1.5px] bg-gray-200 z-0 pointer-events-none" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start w-full relative z-10">
          <div className="w-[48px] shrink-0 flex flex-col items-center pt-1">
            <div className="w-8 h-8 rounded bg-gray-200" />
          </div>
          <div className="flex-1 pl-3 w-full">
            <div className="w-full h-20 rounded-[16px] bg-gray-200/80 p-3 flex flex-col justify-between">
              <div className="w-1/3 h-4 bg-gray-300 rounded" />
              <div className="w-4/5 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
