import React from "react";
import { useNavigate } from "react-router-dom";
import { Header, WeeklyCalendar, StatsBlock, RecentEntries, JournalFolders } from "@/features/home/components";
import { AddMemoryButton } from "@/components/ui/AddMemoryButton";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col relative h-full overflow-x-hidden">
      {/* Scrollable content area */}
      <div className="w-full flex flex-col gap-6 pb-24 pt-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="px-4 sm:px-5">
          <Header />
        </div>
        <div className="px-4 sm:px-5">
          <WeeklyCalendar />
        </div>
        <div className="px-4 sm:px-5">
          <StatsBlock />
        </div>
        <RecentEntries />
        <div className="px-4 sm:px-5">
          <JournalFolders />
        </div>
      </div>

      {/* Bottom Blur Overlay constrained to app width (max-w-[480px]) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div
          className="w-full max-w-[480px] h-[140px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(242, 243, 238, 0) 0%, rgba(242, 243, 238, 0.4) 55%, rgba(242, 243, 238, 0.88) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
          }}
        />
      </div>

      {/* Floating Action Button constrained within mobile frame */}
      <div className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ bottom: "calc(2vh + 100px)" }}>
        <div className="w-full max-w-[480px] flex justify-end px-[4.5%] pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out">
          <AddMemoryButton
            compact={false}
            onClick={() => navigate("/journal/write")}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
