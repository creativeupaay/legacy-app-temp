import React from "react";
import { ChevronRight } from "@/components/ui/icons";
import { theme } from "@/theme/theme";

export interface JournalEntryCardProps {
  entryId: string;
  heading: string; // includes emoji prefix if present, e.g. "🌤️ Title"
  type: "written" | "audio";
  bodyText?: string; // required if type === "written"
  audioUrl?: string; // required if type === "audio" — used later for actual playback, just stored/passed through for now
  onClick?: () => void; // navigate to entry detail
}

const WAVEFORM_PLACEHOLDER_HEIGHTS = [
  30, 50, 85, 40, 70, 95, 60, 35, 80, 45, 90, 65, 30, 75, 55, 85, 40, 70, 50, 90,
  60, 35, 80, 45, 75, 30, 85, 50, 65, 40, 90, 55, 70, 40, 85, 60, 30, 75, 95, 50,
  80, 35, 65, 90, 45, 70, 85, 40, 60, 75, 50, 85, 35, 70, 90, 45, 80, 60,
];

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")          // remove all HTML tags
    .replace(/&nbsp;/g, " ")            // non-breaking space → regular space
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
};

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entryId,
  heading,
  type,
  bodyText,
  audioUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      data-entry-id={entryId}
      data-audio-url={audioUrl}
      style={{ backgroundColor: theme.colors.surface.default }}
      className="rounded-[16px] w-full min-h-[88px] px-[18px] py-[16px] grid grid-rows-[auto_auto] grid-cols-[1fr_auto] gap-y-[10px] cursor-pointer transition-all duration-200 overflow-hidden box-border"
    >
      {/* Title — row-start: 1, col-start: 1, col-span: 1, min-h: 16px */}
      <p
        style={{
          color: theme.colors.text.primary,
          fontFamily: theme.fonts.nunito,
        }}
        className="col-start-1 col-span-1 row-start-1 row-span-1 min-h-[20px] leading-snug font-bold text-[16.5px] tracking-[-0.2px] truncate m-0 self-center"
      >
        {heading}
      </p>

      {/* Chevron — row-start: 1, col-start: 2 */}
      <div className="col-start-2 row-start-1 self-center flex items-center justify-end pl-2">
        <ChevronRight
          size={18}
          style={{ color: theme.colors.icon.muted }}
          className="shrink-0"
        />
      </div>

      {/* Body / Content Row — row-start: 2, col-start: 1, col-span: 2, w: full, min-h: 32px */}
      {type === "written" ? (
        <p
          style={{
            color: theme.colors.text.secondary,
            fontFamily: theme.fonts.sans,
          }}
          className="col-start-1 col-span-2 row-start-2 row-span-1 w-full min-h-[36px] text-[13.5px] tracking-[0.1px] leading-[20px] line-clamp-2 m-0 overflow-hidden"
        >
          {stripHtml(bodyText)}
        </p>
      ) : (
        /* Waveform placeholder — centered vertical bars spanning 100% of inner card width (col-span-2) */
        <div className="col-start-1 col-span-2 row-start-2 row-span-1 w-full h-8 flex items-center justify-between gap-[2px] overflow-hidden">
          {WAVEFORM_PLACEHOLDER_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full shrink-0"
              style={{
                backgroundColor: theme.colors.text.tertiary,
                height: `${Math.min(100, Math.max(20, h))}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
