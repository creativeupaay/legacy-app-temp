import React from "react";
import QuickViewCalendarDate from "@/components/ui/QuickViewCalendarDate";
import { useGetProfileInsightsQuery } from "@/features/profile";

export const WeeklyCalendar: React.FC = () => {
  const { data: insightsResponse } = useGetProfileInsightsQuery();
  const activeDaysStr = insightsResponse?.data?.insights?.activeDays || [];
  const activeDaysSet = new Set(activeDaysStr);

  const today = new Date();
  const currentDayOfWeek = today.getDay(); 
  const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - distanceToMonday);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const dateNum = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dateNum}`;
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[d.getDay()];

    const isActive = activeDaysSet.has(dateStr);
    const isToday = d.toDateString() === today.toDateString();

    let variant: "empty" | "completed" | "streak" = "empty";
    if (isActive) {
      variant = isToday ? "streak" : "completed";
    }

    return {
      day: dayName,
      date: dateNum,
      variant
    };
  });

  return (
    <div 
      className="flex items-center justify-between mx-auto w-full max-w-[361px] h-[61px]"
    >
      {days.map((item, i) => (
        <QuickViewCalendarDate
          key={i}
          day={item.day}
          date={item.date}
          variant={item.variant}
        />
      ))}
    </div>
  );
};

export default WeeklyCalendar;
