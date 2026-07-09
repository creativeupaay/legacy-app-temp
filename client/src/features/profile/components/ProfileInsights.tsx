import React from "react";
import { Card } from "@/components/ui";
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
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridAutoRows: "1fr",
    gap: "12px",
    width: "100%",
  };

  const cardStyle: React.CSSProperties = {
    background: theme.colors.surface.insightsCard,
    border: `0.8px solid ${theme.colors.stroke.insightsBorder}`,
    borderRadius: "10px",
    boxShadow: theme.shadows.insightsCard,
    padding: "16px 20px",
    minHeight: "clamp(80px, 22vw, 90px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "4px",
    width: "100%",
    boxSizing: "border-box",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.sans,
    fontWeight: 500,
    fontSize: "11px",
    lineHeight: "16.5px",
    letterSpacing: "0.7px",
    color: theme.colors.text.sectionTitle || "#928C88",
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[480px] mx-auto flex flex-col gap-2 box-border">
        <h3 style={sectionTitleStyle} className="uppercase pl-1 m-0">
          INSIGHTS
        </h3>
        <div style={gridStyle} className="animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                border: `0.8px solid ${theme.colors.stroke.insightsBorder}`,
                borderRadius: "10px",
                backgroundColor: theme.colors.surface.elevated,
                minHeight: "clamp(80px, 22vw, 90px)",
                width: "100%",
              }}
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
    <div className="w-full max-w-[480px] mx-auto flex flex-col gap-2 box-border">
      <h3 style={sectionTitleStyle} className="uppercase pl-1 m-0">
        INSIGHTS
      </h3>
      <div style={gridStyle}>
        {items.map((item, idx) => (
          <Card
            key={idx}
            variant="default"
            style={cardStyle}
            className="!rounded-[10px] !p-[16px_20px] transition-transform hover:scale-[1.01] cursor-default h-full"
          >
            <span
              style={{
                fontFamily: theme.fonts.sans,
                fontWeight: 500,
                fontSize: "clamp(28px, 7vw, 34px)",
                lineHeight: "clamp(28px, 7vw, 34px)",
                letterSpacing: "-0.5px",
                color: theme.colors.text.primary || "#010102",
              }}
              className="truncate w-full text-left"
            >
              {item.value}
            </span>
            <span
              style={{
                fontFamily: theme.fonts.sans,
                fontWeight: 400,
                fontSize: "clamp(11px, 2.8vw, 12px)",
                lineHeight: "12px",
                letterSpacing: "-0.12px",
                color: theme.colors.text.secondary || "#6B6B6F",
              }}
              className="w-full text-left"
            >
              {item.label}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileInsights;
