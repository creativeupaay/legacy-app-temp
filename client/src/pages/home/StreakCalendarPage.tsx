import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { useGetProfileInsightsQuery } from "@/features/profile";
import { theme } from "@/theme/theme";

const StreakCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: insightsResponse } = useGetProfileInsightsQuery();
  const streak = insightsResponse?.data?.insights?.streak || 0;
  const activeDaysStr = insightsResponse?.data?.insights?.activeDays || [];
  
  // Convert activeDays to a Set of "YYYY-MM-DD" for O(1) lookup
  const activeDaysSet = new Set(activeDaysStr);
  console.log("Active Days from backend:", activeDaysStr);

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Generate calendar grid array
  const calendarGrid = [];
  // Empty slots before the 1st
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push(i);
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="w-full min-h-screen bg-[#F8F8F3] flex flex-col relative overflow-x-hidden">
      {/* SVG Clip Path Definition */}
      {/* SVG Clip Path Definition */}
      <svg width="0" height="0" className="absolute w-0 h-0">
        <defs>
          <clipPath id="wave" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0 0.7 C 0.08 0.7, 0.17 0.9, 0.25 0.9 C 0.33 0.9, 0.42 0.7, 0.5 0.7 C 0.58 0.7, 0.67 0.9, 0.75 0.9 C 0.83 0.9, 0.92 0.7, 1 0.7 L 1 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Top Background Section */}
      <div 
        className="w-full absolute top-0 left-0 right-0 z-0"
        style={{
          height: "328px",
          backgroundColor: "#C3E7F9",
          clipPath: "url(#wave)",
          WebkitClipPath: "url(#wave)"
        }}
      />

      {/* Foreground Content */}
      <div className="z-10 flex flex-col w-full flex-1">
        {/* Top Content Wrapper (matches blue background height) */}
        <div style={{ height: "328px" }} className="w-full flex flex-col">
          {/* Header Bar */}
        <div className="w-full flex justify-between items-center px-[16px] py-[11px] h-[66px]">
          <IconButton 
            variant="close" 
            aria-label="Close"
            onClick={() => navigate(-1)} 
          />
        </div>

        {/* Streak Display */}
        <div className="w-full flex flex-col items-center justify-center mt-4">
          <div className="flex items-center justify-center gap-1">
            <Zap 
              style={{ 
                width: "48px", 
                height: "46px", 
                color: "#6798B099", 
                fill: "#1C274C" 
              }} 
              strokeWidth={1.5}
            />
            <span 
              style={{ 
                fontFamily: theme.fonts.heading, 
                color: "#000000",
                fontSize: "53px",
                lineHeight: "53px",
                height: "53px",
                display: "flex",
                alignItems: "center"
              }}
              className="font-medium tracking-tight"
            >
              {streak}
            </span>
          </div>
          <span 
            style={{ 
              fontFamily: theme.fonts.nunito || "Nunito, sans-serif",
              color: "#000000",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "100%",
              letterSpacing: "-0.32px",
              textAlign: "center",
              width: "90px",
              height: "20px",
              marginTop: "4px"
            }}
          >
            day streak
          </span>
        </div>
        </div>

        {/* Bottom Content Area */}
        <div 
          className="mx-auto flex flex-col pb-24"
          style={{
            marginTop: "-60px",
            width: "100%",
            maxWidth: "393px",
            paddingTop: "40px",
            paddingRight: "16px",
            paddingLeft: "16px",
            gap: "16px"
          }}
        >
          <h2 
            style={{ 
              fontFamily: "Inter, sans-serif", 
              color: "#000000",
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: "100%",
              letterSpacing: "0px",
              width: "100%"
            }}
            className="flex items-center"
          >
            Streak Calendar
          </h2>

          {/* Calendar Card */}
          <div 
            style={{
              width: "100%",
              maxWidth: "361px",
              borderRadius: "17px",
              padding: "24px",
              backgroundColor: "#F2F3EE",
              border: "1px solid #ACACAC",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            {/* Month Header */}
            <div className="flex items-center justify-between px-2">
              <button onClick={handlePrevMonth} className="active:scale-90 transition-transform">
                <ChevronLeft size={20} style={{ color: theme.colors.icon.muted }} />
              </button>
              <div 
                className="bg-[#E9F4F9] px-4 py-1.5 rounded-full font-semibold text-[16px]"
                style={{ color: "#3B5A70" }}
              >
                {monthName} {year}
              </div>
              <button onClick={handleNextMonth} className="active:scale-90 transition-transform">
                <ChevronRight size={20} style={{ color: theme.colors.icon.muted }} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7">
              {weekdays.map((day) => (
                <div 
                  key={day} 
                  className="flex justify-center text-[13px] font-medium"
                  style={{ color: theme.colors.text.tertiary }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-5">
              {calendarGrid.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;

                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isActive = activeDaysSet.has(dateStr);

                return (
                  <div key={day} className="flex justify-center items-center">
                    <div 
                      className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isActive ? theme.colors.primary.motivation : "transparent",
                      }}
                    >
                      <span 
                        className={`text-[15px] ${isActive ? "font-semibold" : "font-normal"}`}
                        style={{ color: isActive ? theme.colors.text.primary : theme.colors.text.secondary }}
                      >
                        {day}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-[2vh] left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[480px] flex justify-center">
          <div
            style={{
              width: "134px",
              height: "5px",
              borderRadius: "100px",
              backgroundColor: "#000000",
              opacity: 1,
            }}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export default StreakCalendarPage;
