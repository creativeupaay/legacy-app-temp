import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { MoreHorizontal, Lock, Globe, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setDraftTitle, setDraftBody } from "@/features/journal/slice/journalSlice";
import { IconButton } from "@/components/ui";
import { theme } from "@/theme/theme";
import { useGetJournalByIdQuery } from "@/features/journal/api/journalApi";
import { EntryPrivacy } from "@/features/journal/types/journal.types";
import { UpdateDialog, DeleteDialog, JournalEditorToolbar } from "@/features/journal/components";
import { useJournalEditor, useJournalDialogs } from "@/features/journal/hooks";


type PageMode = "create" | "view" | "edit";

const JournalWritePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /* ── URL param: present only for /journal/:entryId ── */
  const { entryId } = useParams<{ entryId?: string }>();
  const isExistingEntry = Boolean(entryId);

  /* ── Page mode ── */
  const [mode, setMode] = useState<PageMode>(isExistingEntry ? "view" : "create");

  /* ── Redux draft (Create mode only) ── */
  const { draftTitle, draftBody } = useAppSelector((state) => state.journal);

  /* ── Editor Hook ── */
  const {
    quillRef,
    activeFormats,
    quillModules,
    quillFormats,
    toggleFormat,
    toggleHeading,
    handleUndo,
    handleRedo,
    handleMicrophoneClick,
  } = useJournalEditor(mode);

  /* ── Local state (View / Edit mode only) ── */
  const [localTitle, setLocalTitle] = useState("");
  const [localBody, setLocalBody] = useState("");
  const [localPrivacy, setLocalPrivacy] = useState<EntryPrivacy>(EntryPrivacy.PRIVATE);
  const [localSharedWith, setLocalSharedWith] = useState<string[]>([]);
  const [localEntryDate, setLocalEntryDate] = useState<string>("");

  /* ── UI state ── */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Dialogs & Mutations Hook ── */
  const {
    showUpdateDialog,
    setShowUpdateDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isSaving,
    isDeleting,
    handleUpdate,
    handleDelete,
  } = useJournalDialogs({
    entryId,
    localTitle,
    localBody,
    localPrivacy,
    localSharedWith,
    navigate,
  });

  /* ── API Query ── */
  const { data: entry } = useGetJournalByIdQuery(entryId ?? "", { skip: !entryId });

  /* ── Populate local state when entry loads ── */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!entry) return;
    setLocalTitle(entry.title ?? "");
    setLocalBody(entry.textBody ?? "");
    setLocalPrivacy(entry.privacy ?? EntryPrivacy.PRIVATE);
    setLocalSharedWith(entry.sharedWith ?? []);
    const date = entry.entryDate ?? entry.createdAt;
    setLocalEntryDate(
      date instanceof Date ? date.toISOString() : (date as string) || new Date().toISOString()
    );
  }, [entry]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* ── Scroll to top on mount ── */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  /* ── Date display ── */
  const formattedDate = useMemo(() => {
    const base = isExistingEntry && localEntryDate ? new Date(localEntryDate) : new Date();
    return base.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  }, [isExistingEntry, localEntryDate]);

  /* ── Validation ── */
  const createCanSave =
    draftTitle.trim().length > 0 ||
    (draftBody.trim().length > 0 &&
      draftBody !== "<p><br></p>" &&
      draftBody !== "<p></p>");

  const editCanSave =
    localTitle.trim().length > 0 ||
    (localBody.trim().length > 0 &&
      localBody !== "<p><br></p>" &&
      localBody !== "<p></p>");

  const handleCreateSave = () => {
    if (!createCanSave) return;
    navigate("/journal/privacy");
  };

  const handleEditSaveClick = () => {
    if (!editCanSave) return;
    setShowUpdateDialog(true);
  };

  /* ── Privacy badge render helper ── */
  const renderPrivacyBadge = () => {
    if (mode === "create") return null;
    let icon = <Lock className="w-3 h-3 shrink-0" />;
    let label = "Private";
    let bg = "rgba(0,0,0,0.05)";
    let color: string = theme.colors.text.secondary;

    if (localPrivacy === EntryPrivacy.SHARED_ALL) {
      icon = <Globe className="w-3 h-3 shrink-0 text-blue-500" />;
      label = "Shared with Everyone";
      bg = "#EFF6FF";
      color = "#2563EB";
    } else if (localPrivacy === EntryPrivacy.SHARED_SPECIFIC) {
      const n = localSharedWith.length;
      icon = <Users className="w-3 h-3 shrink-0 text-purple-500" />;
      label = n > 0 ? `Shared with ${n} Contact${n === 1 ? "" : "s"}` : "Shared with Contacts";
      bg = "#F5F3FF";
      color = "#7C3AED";
    }

    return (
      <div
        style={{
          backgroundColor: bg,
          color,
          fontFamily: theme.fonts.sans,
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium mb-5 self-start"
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  const currentTitle = isCreateMode ? draftTitle : localTitle;
  const currentBody = isCreateMode ? draftBody : localBody;
  const onTitleChange = isCreateMode
    ? (v: string) => dispatch(setDraftTitle(v))
    : (v: string) => setLocalTitle(v);
  const onBodyChange = isCreateMode
    ? (v: string) => dispatch(setDraftBody(v))
    : (v: string) => setLocalBody(v);

  const saveDisabled = isCreateMode ? !createCanSave : !editCanSave;
  const onSaveClick = isCreateMode ? handleCreateSave : handleEditSaveClick;

  /* ========================================================================
   * Render
   * ======================================================================== */
  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg || "#F2F3EE" }}
      className="w-full max-w-[480px] min-h-screen mx-auto flex flex-col p-[5%] pb-4 relative"
    >
      {/* ── Header ── */}
      <div className="relative flex items-center justify-between w-full pt-1 mb-6">
        <div className="z-10">
          <IconButton variant="back" onClick={() => navigate(-1)} aria-label="Go back" />
        </div>

        <span
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.text.secondary || "#71717A",
          }}
          className="absolute left-1/2 -translate-x-1/2 text-[13.5px] font-medium tracking-[0.1px] select-none pointer-events-none text-center"
        >
          {formattedDate}
        </span>

        <div className="z-10 relative" ref={menuRef}>
          {isViewMode ? (
            <>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="More options"
                style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
              >
                <MoreHorizontal
                  className="w-5 h-5"
                  style={{ color: theme.colors.text.primary }}
                />
              </button>

              {isMenuOpen && (
                <div
                  style={{
                    backgroundColor: theme.colors.surface.default,
                    boxShadow:
                      "0px 8px 32px rgba(0,0,0,0.12), 0px 2px 8px rgba(0,0,0,0.06)",
                    fontFamily: theme.fonts.sans,
                  }}
                  className="absolute right-0 top-[calc(100%+8px)] w-[180px] rounded-[18px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setMode("edit");
                      setTimeout(() => quillRef.current?.focus(), 100);
                    }}
                    style={{ color: theme.colors.text.primary }}
                    className="w-full text-left px-4 py-3.5 text-[14px] font-medium hover:bg-black/[0.04] transition-colors cursor-pointer border-b border-black/[0.05]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowDeleteDialog(true);
                    }}
                    className="w-full text-left px-4 py-3.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              type="button"
              disabled={saveDisabled}
              onClick={onSaveClick}
              style={{
                fontFamily: theme.fonts.heading,
                backgroundColor: saveDisabled
                  ? "#E2E2E6"
                  : theme.colors.primary.action || "#1C274C",
                color: saveDisabled ? "#6E6E73" : "#FFFFFF",
              }}
              className="px-5 py-2 rounded-full font-semibold text-[14.5px] tracking-tight transition-all duration-200 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed hover:opacity-95 active:scale-95 shrink-0 cursor-pointer"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* ── Privacy Badge ── */}
      {renderPrivacyBadge()}

      {/* ── Title Input ── */}
      <div className="w-full mb-1">
        <input
          type="text"
          placeholder={isCreateMode ? "Add title" : ""}
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          readOnly={isViewMode}
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text.primary || "#1C274C",
          }}
          className={`w-full bg-transparent text-[26px] sm:text-[28px] font-semibold leading-tight placeholder-[#9CA3AF] focus:outline-none border-none p-0 tracking-[-0.3px] ${
            isViewMode ? "pointer-events-none select-none" : ""
          }`}
        />
      </div>

      {/* ── Editor (React Quill) ── */}
      <div
        className={`flex-1 w-full flex flex-col min-h-[320px] pb-20 ${
          !isViewMode ? "cursor-text" : "cursor-default select-text"
        }`}
        onClick={() => {
          if (!isViewMode) quillRef.current?.focus();
        }}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={currentBody}
          onChange={(content) => {
            if (!isViewMode) onBodyChange(content);
          }}
          placeholder={isCreateMode ? "What's on your mind?" : ""}
          modules={quillModules}
          formats={quillFormats}
          readOnly={isViewMode}
          className="journal-quill-editor w-full flex-1 flex flex-col"
        />
      </div>

      {/* ── Custom Toolbar (Create & Edit modes) ── */}
      {!isViewMode && (
        <JournalEditorToolbar
          activeFormats={activeFormats}
          onToggleHeading={toggleHeading}
          onToggleFormat={toggleFormat}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onMicrophoneClick={handleMicrophoneClick}
        />
      )}

      {/* ── Update Dialog (Edit mode → Save) ── */}
      {showUpdateDialog && (
        <UpdateDialog
          onKeepDate={() => handleUpdate(false)}
          onUpdateDate={() => handleUpdate(true)}
          onDismiss={() => navigate("/journal", { replace: true })}
          isSaving={isSaving}
        />
      )}

      {/* ── Delete Confirm Dialog (View mode → Delete) ── */}
      {showDeleteDialog && (
        <DeleteDialog
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default JournalWritePage;
