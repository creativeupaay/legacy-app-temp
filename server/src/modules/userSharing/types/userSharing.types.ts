import { Document, Types } from "mongoose";

export interface IUserSharing {
  ownerId: Types.ObjectId;       
  recipientUserId: Types.ObjectId; 
  name: string;
  email: string;
  relationship?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSharingDocument extends IUserSharing, Document {}

export interface ICreateContactRequest {
  name: string;
  email: string;
  relationship?: string;
}

export interface IUpdateContactRequest {
  name?: string;
  relationship?: string;
  
}

export interface IContactResponse {
  id: string;
  name: string;
  email: string;
  relationship?: string;
  createdAt: Date;
  updatedAt: Date;
}
