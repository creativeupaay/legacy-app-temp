import { Document, Types } from "mongoose";

export enum EntryPrivacy {
  PRIVATE = "private",
  SHARED_ALL = "shared_all",
  SHARED_SPECIFIC = "shared_specific",
}

export interface IJournalEntry {
  ownerId: Types.ObjectId;
  title: string;
  textBody: string;
  privacy: EntryPrivacy;
  sharedWith: Types.ObjectId[];
  entryDate: Date;
  folderId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJournalEntryDocument extends IJournalEntry, Document {}

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

export interface IEntryResponse {
  id: string;
  ownerId?: string;
  title: string;
  textBody: string;
  privacy: EntryPrivacy;
  sharedWith: string[];
  entryDate: Date;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    fullName: string;
    avatar: string | null;
    email: string;
    relationship?: string;
  };
}
