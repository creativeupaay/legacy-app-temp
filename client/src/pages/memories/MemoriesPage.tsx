import React from "react";
import { theme } from "@/theme/theme";

const MemoriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1
        style={{ color: theme.colors.text.primary }}
        className="text-2xl font-bold"
      >
        Memories
      </h1>
      
    </div>
  );
};

export default MemoriesPage;
