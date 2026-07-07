import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuickViewCalendarDate } from "@/components/ui";
import { theme } from "@/theme/theme";

 // Shared Calendar Grid Helper Hook
 
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function useCalendarGrid(initialDateStr: string | null) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    return initialDateStr ? new Date(initialDateStr) : new Date();
  });

  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const y = currentMonthDate.getFullYear();
  const m = currentMonthDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay(); // 0 (Su) to 6 (Sa)
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const todayStr = new Date().toDateString();

  return {
    currentMonthDate,
    prevMonth,
    nextMonth,
    y,
    m,
    cells,
    WEEKDAYS,
    todayStr,
  };
}

// JournalCalendarWidget
export interface JournalCalendarWidgetProps {
  selectedDateStr: string | null;
  onSelectDate: (dateStr: string | null) => void;
  onClose?: () => void;
}

export const JournalCalendarWidget: React.FC<JournalCalendarWidgetProps> = ({
  selectedDateStr,
  onSelectDate,
}) => {
  const {
    currentMonthDate,
    prevMonth,
    nextMonth,
    y,
    m,
    cells,
    WEEKDAYS: weekdays,
    todayStr,
  } = useCalendarGrid(selectedDateStr);

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.bg || "#F7F7F2",
        borderColor: "#E1E1DF",
        fontFamily: theme.fonts.sans,
      }}
      className="w-full rounded-[24px] border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-5 animate-in fade-in zoom-in-95 duration-200 select-none"
    >
      {/* Top Header: Prev, Month Year pill, Next */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 text-[#8F9BB3] hover:text-[#010102] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          style={{ fontFamily: theme.fonts.heading }}
          className="bg-[#EBF4FF] px-5 py-1.5 rounded-xl font-bold text-[16px] text-[#1E293B] tracking-tight"
        >
          {currentMonthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 text-[#8F9BB3] hover:text-[#010102] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
        {weekdays.map((day) => (
          <span key={day} className="text-[13px] font-medium text-[#8F9BB3]">
            {day}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-2.5 justify-items-center">
        {cells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`empty-${idx}`} className="w-10 h-10" />;
          }
          const cellDate = new Date(y, m, dayNum);
          const cellDateStr = cellDate.toDateString();
          const isToday = cellDateStr === todayStr;
          const isSelected = selectedDateStr === cellDateStr;

          const isYellow = selectedDateStr ? isSelected : isToday;

          return (
            <QuickViewCalendarDate
              key={dayNum}
              day=""
              date={String(dayNum)}
              variant={isYellow ? "completed" : "empty"}
              onClick={() => {
                if (isSelected) {
                  onSelectDate(null);
                } else {
                  onSelectDate(cellDateStr);
                }
              }}
              className={
                isToday && !isYellow
                  ? "border border-black/25 rounded-[24px]"
                  : ""
              }
            />
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. JournalInlineCalendarDropdown
 * ============================================================================ */
export interface JournalInlineCalendarDropdownProps {
  selectedDateStr: string | null;
  onApply: (dateStr: string | null) => void;
  onClose: () => void;
}

export const JournalInlineCalendarDropdown: React.FC<JournalInlineCalendarDropdownProps> = ({
  selectedDateStr,
  onApply,
  onClose,
}) => {
  const {
    currentMonthDate,
    prevMonth,
    nextMonth,
    y,
    m,
    cells,
    WEEKDAYS: weekdays,
    todayStr,
  } = useCalendarGrid(selectedDateStr);

  const [tempSelectedDateStr, setTempSelectedDateStr] = useState<string | null>(
    () => selectedDateStr
  );

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface.bg || "#F7F7F2",
        borderColor: "#E1E1DF",
        fontFamily: theme.fonts.sans,
      }}
      className="w-full rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header: Prev, Month Year pill, Next */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 text-[#8F9BB3] hover:text-[#010102] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          style={{ fontFamily: theme.fonts.heading }}
          className="bg-[#EBF4FF] px-5 py-1.5 rounded-xl font-bold text-[16px] text-[#1E293B] tracking-tight"
        >
          {currentMonthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 text-[#8F9BB3] hover:text-[#010102] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
        {weekdays.map((day) => (
          <span key={day} className="text-[13px] font-medium text-[#8F9BB3]">
            {day}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-2.5 justify-items-center">
        {cells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`empty-${idx}`} className="w-10 h-10" />;
          }
          const cellDate = new Date(y, m, dayNum);
          const cellDateStr = cellDate.toDateString();
          const isToday = cellDateStr === todayStr;
          const isSelected = tempSelectedDateStr === cellDateStr;

          const isYellow = tempSelectedDateStr ? isSelected : isToday;

          return (
            <QuickViewCalendarDate
              key={dayNum}
              day=""
              date={String(dayNum)}
              variant={isYellow ? "completed" : "empty"}
              onClick={() => {
                if (isSelected) {
                  setTempSelectedDateStr(null);
                } else {
                  setTempSelectedDateStr(cellDateStr);
                }
              }}
              className={
                isToday && !isYellow
                  ? "border border-black/25 rounded-[24px]"
                  : ""
              }
            />
          );
        })}
      </div>

      {/* Action buttons at the bottom: Cancel (text) and OK (primary) */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#E1E1DF]">
        <button
          type="button"
          onClick={() => {
            setTempSelectedDateStr(null);
            onApply(null);
            onClose();
          }}
          style={{ fontFamily: theme.fonts.sans }}
          className="px-4 py-1.5 text-[13px] font-semibold text-[#71717A] hover:text-[#010102] hover:bg-black/5 rounded-full transition-colors cursor-pointer select-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(tempSelectedDateStr)}
          style={{
            backgroundColor: theme.colors.primary.action || "#1C274C",
            fontFamily: theme.fonts.sans,
          }}
          className="px-5 py-1.5 text-[13px] font-semibold text-white rounded-full shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer select-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};
