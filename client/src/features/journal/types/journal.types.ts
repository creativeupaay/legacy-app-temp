export const EntryPrivacy = {
  PRIVATE: "private",
  SHARED_ALL: "shared_all",
  SHARED_SPECIFIC: "shared_specific",
} as const;

export type EntryPrivacy = (typeof EntryPrivacy)[keyof typeof EntryPrivacy];


export interface IJournalEntry {
  id: string;
  _id?: string;
  ownerId?: string;
  folderId?: string | null;
  title: string;
  textBody: string;
  privacy: EntryPrivacy;
  sharedWith: string[];
  entryDate: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateEntryRequest {
  title: string;
  textBody: string;
  privacy: EntryPrivacy;
  sharedWith?: string[];
  entryDate?: string;
  folderId?: string | null;
}

export interface IUpdateEntryRequest {
  title?: string;
  textBody?: string;
  privacy?: EntryPrivacy;
  sharedWith?: string[];
  entryDate?: string;
  folderId?: string | null;
}

export interface IListEntriesResponse {
  success: boolean;
  message: string;
  data: {
    entries: IJournalEntry[];
    page: number;
    limit: number;
    total: number;
  };
}

export interface ISingleEntryResponse {
  success: boolean;
  message: string;
  data: {
    entry: IJournalEntry;
  };
}
