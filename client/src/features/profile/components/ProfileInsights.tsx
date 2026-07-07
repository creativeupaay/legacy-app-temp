import React from "react";
import { theme } from "@/theme/theme";
import type { IProfileInsights } from "../types/profile.types";

export interface ProfileInsightsProps {
  insights?: IProfileInsights;
  isLoading?: boolean;
}

export const ProfileInsights: React.FC<ProfileInsightsProps> = ({
  insights,
  isLoading = false,
}) => {
  const cardStyle = {
    background: "linear-gradient(135deg, #FFFFF9 0%, rgba(205, 229, 241, 0.55) 50%, rgba(241, 230, 217, 0.55) 100%)",
    border: "0.8px solid #AAC8DB",
    borderRadius: "10px",
    boxShadow: "1px 1px 3px rgba(0,0,0,0.08)",
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-2 sm:space-y-2.5">
        <h3
          style={{ color: "#8E8E93", fontFamily: theme.fonts.sans }}
          className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider pl-1"
        >
          INSIGHTS
        </h3>
        <div className="w-full grid grid-cols-2 gap-3 sm:gap-3.5 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                border: "0.8px solid #AAC8DB",
                borderRadius: "10px",
                backgroundColor: "#FFFFF9",
              }}
              className="p-3.5 sm:p-4 md:p-5 min-h-[5.5rem] w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  const memoriesCount = insights?.memories ?? 0;
  const streakCount = insights?.streak ?? 0;
  const recipientsCount = insights?.recipients ?? 0;
  const sharedCount = insights?.sharedMemories ?? 0;

  const items = [
    { label: "Memories", value: memoriesCount },
    { label: "Day streak", value: streakCount },
    { label: "Recipients", value: recipientsCount },
    { label: "Shared memories", value: sharedCount },
  ];

  return (
    <div className="w-full space-y-2 sm:space-y-2.5">
      <h3
        style={{ color: "#8E8E93", fontFamily: theme.fonts.sans }}
        className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider pl-1"
      >
        INSIGHTS
      </h3>
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-3.5 items-stretch">
        {items.map((item, idx) => (
          <div
            key={idx}
            style={cardStyle}
            className="p-3.5 sm:p-4 md:p-5 flex flex-col justify-center min-h-[5.5rem] w-full transition-transform hover:scale-[1.01]"
          >
            <span
              style={{ color: "#1C1C1E", fontFamily: theme.fonts.heading }}
              className="text-2xl sm:text-3xl md:text-[32px] font-bold leading-tight tracking-tight truncate"
            >
              {item.value}
            </span>
            <span
              style={{ color: "#8E8E93", fontFamily: theme.fonts.sans }}
              className="text-[11px] sm:text-xs font-normal mt-0.5 truncate"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
