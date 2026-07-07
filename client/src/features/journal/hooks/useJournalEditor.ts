import { useEffect, useRef, useState, useMemo } from "react";
import ReactQuill from "react-quill-new";
import { theme } from "@/theme/theme";


export function useJournalEditor(mode: "create" | "view" | "edit") {
  const quillRef = useRef<ReactQuill>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, unknown>>({});

  /* ── Quill: enable/disable based on mode ── */
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    quill.enable(mode !== "view");
  }, [mode]);

  /* ── Quill: format state listener ── */
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const updateFormats = () => {
      const range = quill.getSelection();
      if (range) setActiveFormats(quill.getFormat(range) || {});
    };
    quill.on("selection-change", updateFormats);
    quill.on("text-change", updateFormats);
    return () => {
      quill.off("selection-change", updateFormats);
      quill.off("text-change", updateFormats);
    };
  }, []);

  /* ── Quill modules & formats ── */
  const quillModules = useMemo(
    () => ({
      toolbar: false,
      history: { delay: 500, maxStack: 100, userOnly: true },
    }),
    []
  );
  const quillFormats = useMemo(
    () => ["header", "bold", "italic", "underline", "color"],
    []
  );

  /* ── Toolbar formatting actions ── */
  const toggleFormat = (format: "bold" | "italic" | "underline") => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    quill.format(format, !quill.getFormat()[format]);
  };

  const toggleHeading = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const h = quill.getFormat().header;
    if (h === 1) quill.format("header", 2);
    else if (h === 2) quill.format("header", false);
    else quill.format("header", 1);
  };

  const handleUndo = () => {
    const quill = quillRef.current?.getEditor();
    (quill?.getModule("history") as { undo: () => void } | undefined)?.undo();
  };

  const handleRedo = () => {
    const quill = quillRef.current?.getEditor();
    (quill?.getModule("history") as { redo: () => void } | undefined)?.redo();
  };

  const handleMicrophoneClick = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, "\n🎙️ [Voice Note Recording - 0:30]\n", {
      bold: true,
      color: theme.colors.primary.action || "#1C274C",
    });
    quill.setSelection(range.index + 30, 0);
  };

  return {
    quillRef,
    activeFormats,
    quillModules,
    quillFormats,
    toggleFormat,
    toggleHeading,
    handleUndo,
    handleRedo,
    handleMicrophoneClick,
  };
}
