import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton, Button } from "@/components/ui";
import {
  useGetJournalByIdQuery,
  useDeleteJournalEntryMutation,
} from "@/features/journal/api/journalApi";
import { theme } from "@/theme/theme";
import { Trash2, Lock, Globe, Users } from "lucide-react";

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};

const JournalDetailPage: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();

  const { data: entry, isLoading, error } = useGetJournalByIdQuery(entryId || "");
  const [deleteEntry, { isLoading: isDeleting }] = useDeleteJournalEntryMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDelete = async () => {
    if (!entryId) return;
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      try {
        await deleteEntry(entryId).unwrap();
        navigate("/journal", { replace: true });
      } catch (err) {
        alert("Failed to delete journal entry");
      }
    }
  };

  const getPrivacyIcon = (privacy?: string) => {
    if (privacy === "shared_all") return <Globe className="w-3.5 h-3.5 text-blue-600" />;
    if (privacy === "shared_specific") return <Users className="w-3.5 h-3.5 text-purple-600" />;
    return <Lock className="w-3.5 h-3.5 text-gray-500" />;
  };

  const getPrivacyLabel = (privacy?: string) => {
    if (privacy === "shared_all") return "Shared with Everyone";
    if (privacy === "shared_specific") return "Shared with Contacts";
    return "Private";
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[480px] mx-auto min-h-screen p-[5%] flex items-center justify-center">
        <span className="text-gray-400 animate-pulse text-sm">Loading entry...</span>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="w-full max-w-[480px] mx-auto min-h-screen p-[5%] flex flex-col items-center justify-center text-center">
        <p className="text-gray-600 mb-4">Journal entry not found.</p>
        <Button variant="secondary" onClick={() => navigate("/journal")}>
          Back to Journal
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(entry.entryDate || entry.createdAt).toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg }}
      className="w-full max-w-[480px] min-h-screen mx-auto flex flex-col p-[5%] pb-12"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-6 pt-2">
        <IconButton variant="back" onClick={() => navigate(-1)} aria-label="Go back" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            title="Delete entry"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date & Privacy Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.secondary }}
          className="text-[13px] font-semibold uppercase tracking-wider"
        >
          {formattedDate}
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-2xs">
          {getPrivacyIcon(entry.privacy)}
          <span>{getPrivacyLabel(entry.privacy)}</span>
        </div>
      </div>

      {/* Title */}
      <h1
        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text.primary }}
        className="text-[28px] font-bold leading-tight mb-6"
      >
        {entry.title}
      </h1>

      {/* Body Content */}
      <div
        style={{ backgroundColor: theme.colors.surface.default }}
        className="rounded-[20px] p-6 shadow-xs border border-black/5 min-h-[300px] leading-relaxed text-[16px] text-gray-800"
      >
        {stripHtml(entry.textBody) ? (
          <div
            className="quill-content prose prose-sm max-w-none [&_p]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: entry.textBody }}
          />
        ) : (
          <span className="text-gray-400 italic">No written notes.</span>
        )}
      </div>
    </div>
  );
};

export default JournalDetailPage;
