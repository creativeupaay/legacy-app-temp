import React from "react";
import { theme } from "@/theme/theme";

const JournalPage: React.FC = () => {
  return (
    <div className="w-full max-w-[393px] min-h-[852px] mx-auto pb-[34px] flex flex-col gap-6">
      <div>
        <h1
          style={{ color: theme.colors.text.primary }}
          className="text-2xl font-bold"
        >
          Journal
        </h1>
        <p
          style={{ color: theme.colors.text.muted }}
          className="text-sm mt-1"
        >
          Your recorded memories and written stories.
        </p>
      </div>
    </div>
  );
};

export default JournalPage;
