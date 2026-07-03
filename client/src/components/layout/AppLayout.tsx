import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationBar } from "@/components/ui";
import { theme } from "@/theme/theme";

const AppLayout: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg }}
      className="flex flex-col min-h-screen relative"
    >
      <main className="flex-1 p-[5%] pb-[14vh] overflow-y-auto">
        <Outlet />
      </main>
      <div className="fixed bottom-[2vh] left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[480px] flex flex-col items-center">
          <NavigationBar />
          <div className="w-full flex justify-center mt-[21px]">
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
    </div>
  );
};

export default AppLayout;
