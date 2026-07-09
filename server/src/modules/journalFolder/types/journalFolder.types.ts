import { Document, Types } from "mongoose";

export interface IJournalFolder {
  ownerId: Types.ObjectId;
  name: string;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJournalFolderDocument extends IJournalFolder, Document {}

export interface ICreateFolderRequest {
  name: string;
  icon: string;
  color: string;
}

export interface IUpdateFolderRequest {
  name?: string;
  icon?: string;
  color?: string;
}

export type DeleteFolderAction = "move_to_all_entries" | "move" | "delete_all";

export interface IDeleteFolderRequest {
  action: DeleteFolderAction;
}

export interface IFolderResponse {
  id: string | null;
  name: string;
  icon: string;
  color: string;
  journalCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
