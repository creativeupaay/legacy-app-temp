import React from "react";
import { Undo2, Redo2 } from "lucide-react";
import { IconButton } from "@/components/ui";
import { theme } from "@/theme/theme";

 
 //Journal Editor Toolbar
export interface JournalEditorToolbarProps {
  activeFormats: Record<string, unknown>;
  onToggleHeading: () => void;
  onToggleFormat: (format: "bold" | "italic" | "underline") => void;
  onUndo: () => void;
  onRedo: () => void;
  onMicrophoneClick: () => void;
}

export const JournalEditorToolbar: React.FC<JournalEditorToolbarProps> = ({
  activeFormats,
  onToggleHeading,
  onToggleFormat,
  onUndo,
  onRedo,
  onMicrophoneClick,
}) => {
  return (
    <div className="sticky bottom-4 left-0 right-0 w-full z-30 pt-2 pb-[max(env(safe-area-inset-bottom),12px)] pointer-events-none flex justify-center mt-auto">
      <div
        style={{
          backgroundColor: "#F8F8FA",
          borderColor: "rgba(225, 225, 223, 0.8)",
          boxShadow:
            "0px 4px 20px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)",
        }}
        className="pointer-events-auto w-full max-w-[440px] rounded-full px-2.5 py-1.5 border flex items-center justify-between gap-1 select-none transition-all"
      >
        {/* 1. Microphone */}
        <IconButton
          variant="audio"
          onClick={onMicrophoneClick}
          aria-label="Insert voice note placeholder"
          className="!w-9 !h-9 !min-w-[36px] !min-h-[36px] !max-w-[36px] !max-h-[36px] !shadow-sm [&>svg]:!w-4 [&>svg]:!h-4 !border-[#E5C438]"
        />

        {/* 2. Aa (Heading) */}
        <button
          type="button"
          onClick={onToggleHeading}
          style={{
            backgroundColor: activeFormats.header ? "#1C274C" : "#F2F2F7",
            color: activeFormats.header ? "#FFFFFF" : "#1C274C",
            fontFamily: theme.fonts.heading,
          }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center font-semibold text-[14px] hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Toggle heading size"
        >
          Aa
        </button>

        {/* 3. Bold */}
        <button
          type="button"
          onClick={() => onToggleFormat("bold")}
          style={{
            backgroundColor: activeFormats.bold ? "#1C274C" : "#F2F2F7",
            color: activeFormats.bold ? "#FFFFFF" : "#1C274C",
            fontFamily: theme.fonts.heading,
          }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center font-bold text-[15px] hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Bold"
        >
          B
        </button>

        {/* 4. Italic */}
        <button
          type="button"
          onClick={() => onToggleFormat("italic")}
          style={{
            backgroundColor: activeFormats.italic ? "#1C274C" : "#F2F2F7",
            color: activeFormats.italic ? "#FFFFFF" : "#1C274C",
            fontFamily: theme.fonts.serif || "Georgia, serif",
          }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center font-bold italic text-[15px] hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Italic"
        >
          I
        </button>

        {/* 5. Underline */}
        <button
          type="button"
          onClick={() => onToggleFormat("underline")}
          style={{
            backgroundColor: activeFormats.underline ? "#1C274C" : "#F2F2F7",
            color: activeFormats.underline ? "#FFFFFF" : "#1C274C",
            fontFamily: theme.fonts.heading,
          }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center font-semibold underline underline-offset-2 text-[15px] hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Underline"
        >
          U
        </button>

        {/* 6. Undo */}
        <button
          type="button"
          onClick={onUndo}
          style={{ backgroundColor: "#F2F2F7", color: "#1C274C" }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Undo"
        >
          <Undo2 className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* 7. Redo */}
        <button
          type="button"
          onClick={onRedo}
          style={{ backgroundColor: "#F2F2F7", color: "#1C274C" }}
          className="w-9 h-9 min-w-[36px] rounded-[12px] flex items-center justify-center hover:bg-[#E5E5EA] active:scale-95 transition-all shrink-0 cursor-pointer"
          title="Redo"
        >
          <Redo2 className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};
