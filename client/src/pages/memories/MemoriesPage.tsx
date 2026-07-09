import React from "react";
import { theme } from "@/theme/theme";

const MemoriesPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-28 relative">
      <h1
        style={{ color: theme.colors.text.primary }}
        className="text-2xl font-bold"
      >
        Memories
      </h1>

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
    </div>
  );
};

export default MemoriesPage;
