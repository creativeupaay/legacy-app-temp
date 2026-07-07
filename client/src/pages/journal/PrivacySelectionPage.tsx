import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useGetContactsQuery,
} from "@/features/journal/api/journalApi";
import {
  setDraftPrivacy,
  toggleContactSelection,
  resetDraft,
} from "@/features/journal/slice/journalSlice";
import { EntryPrivacy } from "@/features/journal/types/journal.types";
import {
  ShareOptionCard,
  ContactSelectionList,
} from "@/features/journal/components";
import { IconButton, Button } from "@/components/ui";
import { theme } from "@/theme/theme";


const PrivacySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    editingEntryId,
    draftTitle,
    draftBody,
    draftPrivacy,
    selectedContactIds,
  } = useAppSelector((state) => state.journal);

  
  const [selectedOption, setSelectedOption] = useState<"private" | "shared" | null>(
    editingEntryId
      ? draftPrivacy === EntryPrivacy.SHARED_SPECIFIC ||
        draftPrivacy === EntryPrivacy.SHARED_ALL ||
        selectedContactIds.length > 0
        ? "shared"
        : "private"
      : null
  );

  const [validationError, setValidationError] = useState("");

  const { data: contacts = [], isLoading: isLoadingContacts } = useGetContactsQuery();
  const [createJournal, { isLoading: isSaving }] = useCreateJournalEntryMutation();
  const [updateJournal, { isLoading: isUpdating }] = useUpdateJournalEntryMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOnlyMeClick = () => {
    setValidationError("");
    setSelectedOption("private");
    dispatch(setDraftPrivacy(EntryPrivacy.PRIVATE));
  };

  const handleShareClick = () => {
    setValidationError("");
    setSelectedOption("shared");
    dispatch(setDraftPrivacy(EntryPrivacy.SHARED_SPECIFIC));
  };

  const handleContactToggle = (contactId: string) => {
    setValidationError("");
    dispatch(toggleContactSelection(contactId));
  };

  const canSave =
    selectedOption === "private" ||
    (selectedOption === "shared" && selectedContactIds.length > 0);

  const handleSaveEntry = async () => {
    if (!canSave) return;

    if (!draftTitle.trim() && !draftBody.trim()) {
      setValidationError("Cannot save an empty journal entry.");
      return;
    }

    try {
      setValidationError("");
      const targetPrivacy =
        selectedOption === "shared"
          ? EntryPrivacy.SHARED_SPECIFIC
          : EntryPrivacy.PRIVATE;
      const targetSharedWith =
        selectedOption === "shared" ? selectedContactIds : [];

      if (editingEntryId) {
        await updateJournal({
          id: editingEntryId,
          data: {
            title: draftTitle.trim() || "Untitled Memory",
            textBody: draftBody.trim(),
            privacy: targetPrivacy,
            sharedWith: targetSharedWith,
          },
        }).unwrap();
        dispatch(resetDraft());
        navigate(`/journal/${editingEntryId}`, { replace: true });
      } else {
        await createJournal({
          title: draftTitle.trim() || "Untitled Memory",
          textBody: draftBody.trim(),
          privacy: targetPrivacy,
          sharedWith: targetSharedWith,
          entryDate: new Date().toISOString(),
        }).unwrap();
        dispatch(resetDraft());
        navigate("/journal", { replace: true });
      }
    } catch (err: any) {
      setValidationError(
        err?.data?.message || err?.message || "Failed to save journal entry."
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.colors.surface.bg || "#F2F3EE" }}
      className="w-full max-w-[480px] min-h-screen mx-auto flex flex-col justify-between p-[5%] pb-8 select-none"
    >
      <div className="flex flex-col w-full">
        {/* 1. Back button */}
        <div className="flex items-center w-full mb-6 pt-2">
          <IconButton
            variant="back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="!shadow-sm !border-[0.5px] !border-black/5"
          />
        </div>

        {/* 2. Title */}
        <h1
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text.primary || "#1C274C",
          }}
          className="text-[26px] sm:text-[28px] font-bold leading-tight mb-6 tracking-tight"
        >
          Who is this memory for?
        </h1>

        {/* Error Alert */}
        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* 3. Privacy options */}
        <div className="flex flex-col gap-3.5 mb-2">
          <ShareOptionCard
            title="Only Me"
            description="Only you can view this memory."
            isSelected={selectedOption === "private"}
            onClick={handleOnlyMeClick}
          />

          <ShareOptionCard
            title="Share"
            description="Choose who will receive this memory."
            isSelected={selectedOption === "shared"}
            onClick={handleShareClick}
          />
        </div>

        {/* 4. (Conditional Contact List) */}
        {selectedOption === "shared" && (
          <div className="mt-3 mb-4">
            <ContactSelectionList
              contacts={contacts}
              selectedIds={selectedContactIds}
              onToggle={handleContactToggle}
              isLoading={isLoadingContacts}
            />
          </div>
        )}
      </div>

      {/* 5. Bottom Save Button using universal <Button> from Button.tsx */}
      <div className="w-full mt-8 pt-4">
        <Button
          variant={canSave ? "primary" : "disabled"}
          disabled={!canSave || isSaving || isUpdating}
          onClick={handleSaveEntry}
          className="!w-full !h-[52px] !rounded-full !font-bold !text-[16px] !tracking-tight !shadow-md !flex !items-center !justify-center"
        >
          {isSaving || isUpdating ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default PrivacySelectionPage;
