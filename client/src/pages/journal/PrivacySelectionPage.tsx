import React, { useEffect, useState, useMemo } from "react";
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
  setSelectedContactIds,
  resetDraft,
} from "@/features/journal/slice/journalSlice";
import { EntryPrivacy } from "@/features/journal/types/journal.types";
import {
  ShareOptionCard,
  ContactSelectionList,
} from "@/features/journal/components";
import { IconButton, Button, Chip } from "@/components/ui";
import { theme } from "@/theme/theme";


const PrivacySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    editingEntryId,
    draftTitle,
    draftBody,
    draftPrivacy,
    draftFolderId,
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
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

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
    dispatch(
      setDraftPrivacy(
        selectedContactIds.length > 0
          ? EntryPrivacy.SHARED_SPECIFIC
          : EntryPrivacy.SHARED_ALL
      )
    );
  };

  const handleContactToggle = (contactId: string) => {
    setValidationError("");
    if (selectedOption !== "shared") {
      setSelectedOption("shared");
    }
    dispatch(toggleContactSelection(contactId));
    const isSelected = selectedContactIds.includes(contactId);
    const newCount = isSelected
      ? selectedContactIds.length - 1
      : selectedContactIds.length + 1;
    dispatch(
      setDraftPrivacy(
        newCount > 0 ? EntryPrivacy.SHARED_SPECIFIC : EntryPrivacy.SHARED_ALL
      )
    );
  };

  const groups = useMemo(() => {
    const rels = new Set<string>();
    contacts.forEach(c => {
      if (c.relationship) {
        rels.add(c.relationship);
      }
    });
    return ["All", ...Array.from(rels).sort()];
  }, [contacts]);

  const filteredContacts = contacts.filter(
    (c) => selectedGroup === "All" || c.relationship?.toLowerCase() === selectedGroup.toLowerCase()
  );

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    
    if (group !== "All") {
      const groupContacts = contacts.filter(c => c.relationship?.toLowerCase() === group.toLowerCase());
      const groupContactIds = groupContacts.map(c => c.id || c._id || "");
      
      const newSelectedIds = new Set(selectedContactIds);
      groupContactIds.forEach(id => newSelectedIds.add(id));
      const finalIds = Array.from(newSelectedIds);
      dispatch(setSelectedContactIds(finalIds));
      dispatch(setDraftPrivacy(finalIds.length > 0 ? EntryPrivacy.SHARED_SPECIFIC : EntryPrivacy.SHARED_ALL));
    }
  };

  const isAllSelected = filteredContacts.length > 0 && filteredContacts.every(c => selectedContactIds.includes(c.id || c._id || ""));

  const handleSelectAllToggle = () => {
    const currentViewIds = filteredContacts.map(c => c.id || c._id || "");
    let newSelectedIds = new Set(selectedContactIds);

    if (isAllSelected) {
      currentViewIds.forEach(id => newSelectedIds.delete(id));
    } else {
      currentViewIds.forEach(id => newSelectedIds.add(id));
    }
    
    const finalIds = Array.from(newSelectedIds);
    dispatch(setSelectedContactIds(finalIds));
    dispatch(
      setDraftPrivacy(
        finalIds.length > 0 ? EntryPrivacy.SHARED_SPECIFIC : EntryPrivacy.SHARED_ALL
      )
    );
  };

  const canSave = selectedOption !== null;

  const getFriendlyErrorMessage = (err: any): string => {
    if (err?.data?.errors && typeof err.data.errors === "object") {
      const errorsObj = err.data.errors;
      const messages: string[] = [];
      Object.entries(errorsObj).forEach(([field, msgs]: [string, any]) => {
        if (Array.isArray(msgs)) {
          msgs.forEach((msg) => {
            if (field === "textBody" && msg.includes("required")) {
              messages.push("Please write some text for your journal entry.");
            } else if (field === "title" && msg.includes("required")) {
              messages.push("Please enter a title for your journal entry.");
            } else if (field === "sharedWith") {
              messages.push("Please select at least one recipient to share with.");
            } else {
              messages.push(msg);
            }
          });
        } else if (typeof msgs === "string") {
          messages.push(msgs);
        }
      });
      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
    return err?.data?.message || err?.message || "Failed to save journal entry. Please try again.";
  };

  const handleSaveEntry = async () => {
    if (!canSave) return;

    if (!draftTitle.trim() && !draftBody.trim()) {
      setValidationError("Please write a title or story before saving your memory.");
      return;
    }

    try {
      setValidationError("");
      const targetPrivacy =
        selectedOption === "shared"
          ? selectedContactIds.length > 0
            ? EntryPrivacy.SHARED_SPECIFIC
            : EntryPrivacy.SHARED_ALL
          : EntryPrivacy.PRIVATE;
      const targetSharedWith =
        selectedOption === "shared" ? selectedContactIds : [];

      const cleanTitle = draftTitle.trim() || "Untitled Memory";
      const cleanBody = draftBody.trim() || cleanTitle;

      if (editingEntryId) {
        await updateJournal({
          id: editingEntryId,
          data: {
            title: cleanTitle,
            textBody: cleanBody,
            privacy: targetPrivacy,
            sharedWith: targetSharedWith,
            folderId: draftFolderId,
          },
        }).unwrap();
        dispatch(resetDraft());
        navigate(`/journal/${editingEntryId}`, { replace: true });
      } else {
        await createJournal({
          title: cleanTitle,
          textBody: cleanBody,
          privacy: targetPrivacy,
          sharedWith: targetSharedWith,
          entryDate: new Date().toISOString(),
          folderId: draftFolderId,
        }).unwrap();
        dispatch(resetDraft());
        navigate("/journal", { replace: true });
      }
    } catch (err: any) {
      setValidationError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.colors.surface.otherBg }}
      className="w-full max-w-[480px] min-h-screen mx-auto flex flex-col justify-between p-[5%] pb-8 select-none"
    >
      <div className="flex flex-col w-full">
      <div className="relative flex items-center justify-between w-full pt-1 mb-4 gap-2">
        <div className="z-10 flex items-center shrink-0">
          <IconButton
            variant="back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          />
        </div>
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
          <div className="mt-3 mb-4 flex flex-col">
            {/* Group Chips */}
            {!isLoadingContacts && groups.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0 mb-2">
                {groups.map((group) => (
                  <Chip
                    key={group}
                    label={group.charAt(0).toUpperCase() + group.slice(1)}
                    variant={selectedGroup === group ? "primary" : "secondary"}
                    onClick={() => handleGroupSelect(group)}
                    className="capitalize"
                  />
                ))}
              </div>
            )}
            
            {/* Select All / Deselect All */}
            {!isLoadingContacts && filteredContacts.length > 0 && (
              <div className="flex justify-end mb-1 px-1">
                <button
                  type="button"
                  onClick={handleSelectAllToggle}
                  className="text-[13px] font-semibold text-[#2B7FCE] hover:opacity-80"
                >
                  {isAllSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
            )}

            <ContactSelectionList
              contacts={filteredContacts}
              selectedIds={selectedContactIds}
              onToggle={handleContactToggle}
              isLoading={isLoadingContacts}
              hideRelationship={selectedGroup !== "All"}
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
