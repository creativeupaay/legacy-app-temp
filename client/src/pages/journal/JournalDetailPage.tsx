import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconButton } from "@/components/ui";
import { theme } from "@/theme/theme";

const JournalDetailPage: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <IconButton variant="back" aria-label="Go back" onClick={() => navigate(-1)} />
        <h1
          style={{ color: theme.colors.text.primary }}
          className="text-xl font-bold"
        >
          Journal Entry Detail
        </h1>
      </div>
      <div
        style={{
          backgroundColor: theme.colors.surface.default,
          borderColor: theme.colors.stroke.border,
        }}
        className="rounded-xl p-6 border shadow-sm space-y-4"
      >
        <div
          style={{
            backgroundColor: theme.colors.surface.neutral,
            color: theme.colors.text.secondary,
          }}
          className="text-xs font-mono px-3 py-1 rounded inline-block"
        >
          Entry ID: {entryId}
        </div>
        <p style={{ color: theme.colors.text.muted }} className="text-sm">
          This is a stub for the full journal entry view (written story or audio playback).
        </p>
      </div>
    </div>
  );
};

export default JournalDetailPage;
