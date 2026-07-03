import React from "react";
import { theme } from "@/theme/theme";

const HomePage: React.FC = () => {
  const headingStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <h1
          style={headingStyle}
          className="text-2xl font-bold m-0"
        >
          Home
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
