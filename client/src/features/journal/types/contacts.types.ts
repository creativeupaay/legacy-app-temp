export interface IContact {
  id: string;
  _id?: string;
  ownerId?: string;
  recipientUserId?: string;
  name: string;
  email: string;
  avatar?: string | null;
  relationship?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ICreateContactRequest {
  name: string;
  email: string;
  relationship?: string;
}

export interface IListContactsResponse {
  success: boolean;
  message: string;
  data: {
    contacts: IContact[];
  };
}

export interface ISingleContactResponse {
  success: boolean;
  message: string;
  data: {
    contact: IContact;
  };
}
