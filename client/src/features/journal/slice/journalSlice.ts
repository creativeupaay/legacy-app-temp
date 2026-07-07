import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { EntryPrivacy } from "../types/journal.types";

export interface JournalState {
  editingEntryId: string | null;
  draftTitle: string;
  draftBody: string;
  draftPrivacy: EntryPrivacy;
  shareSubOption: "everyone" | "selected" | null;
  selectedContactIds: string[];
  activeFilter: "all" | "memories";
  isBottomSheetOpen: boolean;
}

const initialState: JournalState = {
  editingEntryId: null,
  draftTitle: "",
  draftBody: "",
  draftPrivacy: EntryPrivacy.PRIVATE,
  shareSubOption: null,
  selectedContactIds: [],
  activeFilter: "all",
  isBottomSheetOpen: false,
};

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setEditingEntryId: (state, action: PayloadAction<string | null>) => {
      state.editingEntryId = action.payload;
    },
    setDraftTitle: (state, action: PayloadAction<string>) => {
      state.draftTitle = action.payload;
    },
    setDraftBody: (state, action: PayloadAction<string>) => {
      state.draftBody = action.payload;
    },
    setDraftPrivacy: (state, action: PayloadAction<EntryPrivacy>) => {
      state.draftPrivacy = action.payload;
    },
    setShareSubOption: (
      state,
      action: PayloadAction<"everyone" | "selected" | null>
    ) => {
      state.shareSubOption = action.payload;
      if (action.payload === "everyone") {
        state.draftPrivacy = EntryPrivacy.SHARED_ALL;
        state.selectedContactIds = [];
      } else if (action.payload === "selected") {
        state.draftPrivacy = EntryPrivacy.SHARED_SPECIFIC;
      }
    },
    toggleContactSelection: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const index = state.selectedContactIds.indexOf(contactId);
      if (index > -1) {
        state.selectedContactIds.splice(index, 1);
      } else {
        state.selectedContactIds.push(contactId);
      }
    },
    setSelectedContactIds: (state, action: PayloadAction<string[]>) => {
      state.selectedContactIds = action.payload;
    },
    setActiveFilter: (state, action: PayloadAction<"all" | "memories">) => {
      state.activeFilter = action.payload;
    },
    setIsBottomSheetOpen: (state, action: PayloadAction<boolean>) => {
      state.isBottomSheetOpen = action.payload;
    },
    resetDraft: (state) => {
      state.editingEntryId = null;
      state.draftTitle = "";
      state.draftBody = "";
      state.draftPrivacy = EntryPrivacy.PRIVATE;
      state.shareSubOption = null;
      state.selectedContactIds = [];
    },
  },
});

export const {
  setEditingEntryId,
  setDraftTitle,
  setDraftBody,
  setDraftPrivacy,
  setShareSubOption,
  toggleContactSelection,
  setSelectedContactIds,
  setActiveFilter,
  setIsBottomSheetOpen,
  resetDraft,
} = journalSlice.actions;

export default journalSlice.reducer;

