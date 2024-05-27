import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia, solarizedlight } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const CodeText: React.FC<{ children: string; language?: string }> = ({ children, language = "javascript" }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Choose the theme based on the resolvedTheme
  const themeStyle = isDarkMode ? okaidia : solarizedlight;

  // State to show copy success message
  const [isCopied, setIsCopied] = useState(false);

  // Function to copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={copyToClipboard}
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          zIndex: 10,
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.5)",
          border: "none",
          borderRadius: "5px",
          padding: "5px 10px",
          fontSize: "0.8rem",
        }}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={themeStyle}
        customStyle={{
          padding: "16px",
          borderRadius: "8px",
          marginTop: "16px",
          fontFamily: "monospace",
          background: isDarkMode ? "#2D2D2D" : "#F5F5F5",
          position: "relative", // Required for absolute positioning of the button
          overflow: "hidden", // Ensures no scrollbars are visible
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
