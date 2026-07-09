import React from "react";
import { ChevronRight, Lock } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";

export type MemoryCardVariant = "shared" | "private";

const CONTACT_PASTELS = [
  { bg: "#CDE5F1", text: "#1C274C" },
  { bg: "#DCEFD8", text: "#1F3B1F" },
  { bg: "#F2E4D8", text: "#3B2A1E" },
  { bg: "#EAE3F2", text: "#2E1E3B" },
];

export interface MemoryUICardProps {
  variant: MemoryCardVariant;
  dateMonthDay: string;
  dateYear: string;
  title: string;
  bodyText: string;
  count: number;
  avatarUrls?: string[]; 
  sharedRecipients?: Array<{ name?: string; avatar?: string | null; email?: string }>;
  onClick?: () => void;
  className?: string;
}

const stripHtml = (html: string): string => {
  if (!html) return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent || "").trim().replace(/\s+/g, " ");
  } catch {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
};

export const MemoryUICard: React.FC<MemoryUICardProps> = ({
  variant,
  dateMonthDay,
  dateYear,
  title,
  bodyText,
  count,
  avatarUrls = [],
  sharedRecipients = [],
  onClick,
  className = "",
}) => {
  const cleanTitle = stripHtml(title) || "Untitled";
  const cleanBodyText = stripHtml(bodyText);

  return (
    <div
      onClick={onClick}
      data-component="Memory UI Card"
      data-variant={variant === "shared" ? "Shared" : "Private"}
      style={{
        backgroundColor: "var(--Surface-Elevated, #FFFFF9)",
        borderColor: "#F9F9F3",
      }}
      className={`w-[200px] h-[120px] rounded-[7px] border-[1px] grid grid-rows-3 grid-cols-[1fr_auto] gap-x-[10px] gap-y-[8px] pt-[10px] pl-[14px] pr-[14px] pb-[10px] cursor-pointer relative overflow-hidden box-border shrink-0 ${className}`.trim()}
    >
      {/* date-container */}
      <div
        data-component="date-container"
        className="row-start-1 col-start-1 flex items-center gap-[4px] w-[71px] h-[12px]"
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--Text-Primary, #010102)",
          }}
          className="font-light text-[12px] leading-[100%] tracking-[-0.01em] text-center w-[38px] h-[12px] flex items-center justify-center shrink-0"
        >
          {dateMonthDay}
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--Text-Secondary, #6B6B6F)",
          }}
          className="font-light text-[12px] leading-[100%] tracking-[-0.01em] text-center w-[29px] h-[12px] flex items-center justify-center truncate"
        >
          {dateYear}
        </span>
      </div>

      {/* Text group */}
      <div data-component="Text" className="row-start-2 col-start-1 flex flex-col gap-[2px] w-[172px] h-[35px] -mt-1.5">
        <p
          data-component="entry-title"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--Text-Primary, #010102)",
          }}
          className="font-normal text-[16px] leading-[120%] tracking-[0em] truncate m-0 w-[172px] h-[19px]"
        >
          {cleanTitle}
        </p>
        <p
          data-component="Body text"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--Text-Secondary, #6B6B6F)",
          }}
          className="font-normal text-[12px] leading-[120%] tracking-[0em] truncate m-0 w-[172px] h-[14px]"
        >
          {cleanBodyText}
        </p>
      </div>

      {/* private-indicator */}
      <div
        data-component="private-indicator"
        className="row-start-3 col-start-1 flex items-center gap-[8px] self-end w-[43px] h-[22px]"
      >
        {variant === "shared" ? (
          <div data-component="Frame 73" className="flex -space-x-1.5 shrink-0 items-center">
            {sharedRecipients && sharedRecipients.length > 0 ? (
              sharedRecipients.slice(0, 2).map((rec, i) => {
                const pastel = CONTACT_PASTELS[i % CONTACT_PASTELS.length];
                return (
                  <div
                    key={i}
                    className="relative w-[22px] h-[30px] rounded-full border-[1.5px] border-[#FFFFF9] shrink-0 overflow-hidden"
                  >
                    <Avatar
                      src={rec.avatar || undefined}
                      name={rec.name || rec.email || "S"}
                      size="sm"
                      style={{
                        backgroundColor: pastel.bg,
                        color: pastel.text,
                        fontFamily: "Inter, sans-serif",
                      }}
                      className="!w-full !h-full !text-[10px] font-semibold rounded-full !border-0"
                    />
                  </div>
                );
              })
            ) : avatarUrls.length > 0 ? (
              avatarUrls.slice(0, 2).map((url, i) => (
                <div
                  key={i}
                  className="relative w-[22px] h-[30px] rounded-full border-[1.5px] border-[#FFFFF9] shrink-0 overflow-hidden"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative w-[22px] h-[30px] rounded-full border-[1.5px] border-[#FFFFF9] shrink-0 overflow-hidden">
                <Avatar
                  name="Shared"
                  size="sm"
                  style={{
                    backgroundColor: CONTACT_PASTELS[0].bg,
                    color: CONTACT_PASTELS[0].text,
                    fontFamily: "Inter, sans-serif",
                  }}
                  className="!w-full !h-full !text-[10px] font-semibold rounded-full !border-0"
                />
              </div>
            )}
          </div>
        ) : (
          <Lock
            data-component="icon-wrapper/lock"
            style={{ color: "var(--Text-Secondary, #6B6B6F)" }}
            className="w-[14px] h-[14px] shrink-0"
          />
        )}
        <span
          data-component="private-count"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--Text-Secondary, #6B6B6F)",
          }}
          className="font-medium text-[12px] leading-[100%] uppercase tracking-[0.05em]"
        >
          {count}
        </span>
      </div>

      {/* Chevron Icon - exact coordinate top: 92px, left: 168px (bottom: 10px, right: 14px) */}
      <div className="absolute bottom-[10px] right-[14px] flex items-center justify-center">
        <ChevronRight
          data-component="Icon/Vector"
          style={{ color: "var(--Text-Secondary, #6B6B6F)" }}
          className="w-[18px] h-[18px] shrink-0"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default MemoryUICard;
