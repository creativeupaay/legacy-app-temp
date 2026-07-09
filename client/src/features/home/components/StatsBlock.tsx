import React from "react";
import { theme } from "@/theme/theme";
import { useGetProfileInsightsQuery } from "@/features/profile";
import { useGetJournalEntriesQuery } from "@/features/journal/api/journalApi";

export const StatsBlock: React.FC = () => {
  const { data: insightsResponse } = useGetProfileInsightsQuery();
  const { data: journals } = useGetJournalEntriesQuery();
  
  const insights = insightsResponse?.data?.insights;
  const longestStreak = insights?.longestStreak || 0;
  
  // Calculate dynamic data based on actual journals
  const totalEntries = journals?.length || 0;
  const totalWords = journals?.reduce((acc, journal) => {
    if (!journal.textBody) return acc;
    let textContent = journal.textBody;
    try {
      const doc = new DOMParser().parseFromString(journal.textBody, "text/html");
      textContent = doc.body.textContent || "";
    } catch {
      textContent = journal.textBody.replace(/<[^>]+>/g, " ");
    }
    const wordCount = textContent
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;
    return acc + wordCount;
  }, 0) || 0;

  // Format totalWords (e.g., 2300 -> 2.3k)
  const formattedWords = totalWords > 999 
    ? `+${(totalWords / 1000).toFixed(1).replace('.0', '')}k` 
    : totalWords.toString();
  
  const numberStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: theme.fonts.sans,
    color: theme.colors.text.secondary,
  };

  return (
    <div
      className="mx-auto w-full min-h-[72px] py-[16px] px-[16px] rounded-[7px] border-[0.8px] border-[#AAC8DB] shadow-[1px_1px_3px_0px_#0000001F] flex items-center"
      style={{
        background: "linear-gradient(93.66deg, #CDE5F1 32.51%, #F1E6D9 98.81%)",
      }}
    >
      <div className="flex justify-between items-center text-center w-full gap-[8px]">
        <div className="flex-1 flex flex-col items-center gap-1">
          <span style={numberStyle} className="text-[24px] font-medium leading-none text-[#000000]">
            {totalEntries}
          </span>
          <span className="text-[12px] font-normal leading-none tracking-[-0.01em] text-center text-[#6B6B6F]" style={labelStyle}>
            Total entries
          </span>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-1">
          <span style={numberStyle} className="text-[24px] font-medium leading-none text-[#000000]">
            {longestStreak}
          </span>
          <span className="text-[12px] font-normal leading-none tracking-[-0.01em] text-center text-[#6B6B6F]" style={labelStyle}>
            Longest streak
          </span>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-1">
          <span style={numberStyle} className="text-[24px] font-medium leading-none text-[#000000]">
            {formattedWords}
          </span>
          <span className="text-[12px] font-normal leading-none tracking-[-0.01em] text-center text-[#6B6B6F]" style={labelStyle}>
            Words all time
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsBlock;
