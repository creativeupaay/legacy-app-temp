export interface IJournalFolder {
  id: string | null;
  name: string;
  icon: string;
  color: string;
  journalCount: number;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface IListFoldersResponse {
  success: boolean;
  message: string;
  data: {
    folders: IJournalFolder[];
  };
}

export interface ISingleFolderResponse {
  success: boolean;
  message: string;
  data: {
    folder: IJournalFolder;
  };
}
