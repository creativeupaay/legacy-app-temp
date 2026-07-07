import { useState, useCallback } from "react";
import type { NavigateFunction } from "react-router-dom";
import {
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
} from "@/features/journal/api/journalApi";
import { EntryPrivacy } from "@/features/journal/types/journal.types";


export interface UseJournalDialogsParams {
  entryId?: string;
  localTitle: string;
  localBody: string;
  localPrivacy: EntryPrivacy;
  localSharedWith: string[];
  navigate: NavigateFunction;
}

export function useJournalDialogs({
  entryId,
  localTitle,
  localBody,
  localPrivacy,
  localSharedWith,
  navigate,
}: UseJournalDialogsParams) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [updateEntry] = useUpdateJournalEntryMutation();
  const [deleteEntry] = useDeleteJournalEntryMutation();

  const handleUpdate = useCallback(
    async (updateDateToToday: boolean) => {
      if (!entryId) return;
      setIsSaving(true);
      try {
        await updateEntry({
          id: entryId,
          data: {
            title: localTitle,
            textBody: localBody,
            privacy: localPrivacy,
            sharedWith: localSharedWith,
            ...(updateDateToToday ? { entryDate: new Date().toISOString() } : {}),
          },
        }).unwrap();
        setShowUpdateDialog(false);
        navigate("/journal", { replace: true });
      } catch {
        alert("Failed to update journal entry.");
        setIsSaving(false);
      }
    },
    [entryId, localTitle, localBody, localPrivacy, localSharedWith, updateEntry, navigate]
  );

  const handleDelete = useCallback(async () => {
    if (!entryId) return;
    setIsDeleting(true);
    try {
      await deleteEntry(entryId).unwrap();
      setShowDeleteDialog(false);
      navigate("/journal", { replace: true });
    } catch {
      alert("Failed to delete journal entry.");
    } finally {
      setIsDeleting(false);
    }
  }, [entryId, deleteEntry, navigate]);

  return {
    showUpdateDialog,
    setShowUpdateDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    isSaving,
    isDeleting,
    handleUpdate,
    handleDelete,
  };
}
