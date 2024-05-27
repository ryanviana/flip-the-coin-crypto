import React, { ReactNode } from "react";
import { useTheme } from "next-themes";

interface CheckpointProps {
  children: ReactNode;
  title: string;
}

export const Checkpoint: React.FC<CheckpointProps> = ({ children, title }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div
      className={`bg-gradient-to-r ${
        isDarkMode ? "from-blue-700 to-blue-800" : "from-blue-200 to-blue-300"
      } p-6 rounded-lg shadow-xl mb-8`}
    >
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
