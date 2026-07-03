import React from "react";
import { ChevronRight, Lock } from "@/components/ui/icons";
import { theme } from "@/theme/theme";

export type MemoryCardVariant = "shared" | "private";

export interface MemoryUICardProps {
  variant: MemoryCardVariant;
  dateMonthDay: string;
  dateYear: string;
  title: string;
  bodyText: string;
  count: number;
  avatarUrls?: string[]; // shared: up to 2 urls (Frame 72 / Frame 71)
  onClick?: () => void;
  className?: string;
}

export const MemoryUICard: React.FC<MemoryUICardProps> = ({
  variant,
  dateMonthDay,
  dateYear,
  title,
  bodyText,
  count,
  avatarUrls = [],
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      data-component="Memory UI Card"
      data-variant={variant === "shared" ? "Shared" : "Private"}
      style={{
        backgroundColor: theme.colors.surface.elevated,
        borderColor: theme.colors.stroke.yellow,
      }}
      className={`w-full max-w-[12.5rem] min-h-[7.5rem] rounded-[7px] border grid grid-rows-3 grid-cols-[1fr_auto] gap-[10px] pt-[10px] pl-[14px] pr-[14px] pb-[10px] cursor-pointer relative overflow-hidden box-border ${className}`.trim()}
    >
      {/* date-container */}
      <div
        data-component="date-container"
        className="row-start-1 col-start-1 flex items-baseline gap-1 min-w-0 w-full"
      >
        <span
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.primary,
          }}
          className="font-light text-[12px] leading-none tracking-[-0.01em] shrink-0"
        >
          {dateMonthDay}
        </span>
        {/* UNCONFIRMED: whether #676767 is distinct from --Text-Secondary or literal one-off — verify in Figma */}
        <span
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.dateYear,
          }}
          className="font-light text-[12px] leading-none tracking-[-0.01em] truncate"
        >
          {dateYear}
        </span>
      </div>

      {/* Text group */}
      <div data-component="Text" className="row-start-2 col-start-1 min-w-0 w-full">
        <p
          data-component="entry-title"
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.primary,
          }}
          className="font-normal text-[16px] leading-[1.2] truncate m-0 w-full"
        >
          {title}
        </p>
        <p
          data-component="Body text"
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.secondary,
          }}
          className="font-normal text-[12px] leading-[1.2] truncate m-0 mt-0.5 w-full"
        >
          {bodyText}
        </p>
      </div>

      {/* private-indicator */}
      <div
        data-component="private-indicator"
        className="row-start-3 col-start-1 flex items-center gap-2 self-end min-w-0 w-full"
      >
        {variant === "shared" ? (
          <div data-component="Frame 73" className="flex -space-x-2 shrink-0">
            {avatarUrls.slice(0, 2).map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                data-component={i === 0 ? "Frame 72" : "Frame 71"}
                style={{ borderColor: theme.colors.surface.elevated }}
                className="w-[22px] h-[22px] rounded-full border object-cover"
              />
            ))}
          </div>
        ) : (
          /* UNCONFIRMED: Private variant's actual layer structure (not yet verified against Figma). Assuming icon-wrapper/lock replace Frame 73/72 */
          <Lock
            data-component="icon-wrapper/lock"
            style={{ color: theme.colors.icon.muted }}
            className="w-[14px] h-[14px] shrink-0"
          />
        )}
        {/* UNCONFIRMED: letter-spacing 50% captured in Figma; approximated with tracking-wide */}
        <span
          data-component="private-count"
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.secondary,
          }}
          className="font-medium text-[12px] uppercase tracking-wide"
        >
          {count}
        </span>
      </div>

      {/* Icon > Vector (placed in row 3, col 2 to match exact Figma 3x2 grid cell from screenshot) */}
      <div className="row-start-3 col-start-2 flex items-center justify-end self-end">
        <ChevronRight
          data-component="Icon/Vector"
          style={{ color: theme.colors.icon.muted }}
          className="w-4 h-4 shrink-0"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default MemoryUICard;
