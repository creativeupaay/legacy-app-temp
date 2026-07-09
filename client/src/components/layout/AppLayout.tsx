import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationBar } from "@/components/ui";
import { theme } from "@/theme/theme";
import backgroundImage from "@/theme/Background.webp";

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isMainFourPage = ["/home", "/journal", "/memories", "/profile"].includes(
    location.pathname
  );
  const isHomeRoute = ["/home", "/"].includes(location.pathname);

  return (
    <div
      style={{
        backgroundColor: isMainFourPage ? "transparent" : theme.colors.surface.otherBg,
      }}
      className="flex flex-col min-h-screen relative w-full"
    >
      {/* High-resolution responsive background image strictly for the main 4 pages */}
      {isMainFourPage && (
        <div
          style={{
            backgroundColor: theme.colors.surface.mainBg,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="fixed inset-0 w-full max-w-[480px] mx-auto h-full pointer-events-none z-0"
        />
      )}
      <main className={`flex-1 relative ${isHomeRoute ? "pb-[14vh]" : "p-[4%] pb-[14vh]"}`}>
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
