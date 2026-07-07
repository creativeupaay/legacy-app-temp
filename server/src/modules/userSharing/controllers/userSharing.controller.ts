import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import UserSharing from "../models/userSharing.model";
import AuthUser from "../../auth/models/authuser.model";
import { IUserSharingDocument, IContactResponse } from "../types/userSharing.types";
import { CreateContactInput, UpdateContactInput } from "../validators/userSharing.validator";


function toContactResponse(doc: IUserSharingDocument): IContactResponse {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    relationship: doc.relationship,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}


export const createContact = asyncHandler(
  async (req: Request<{}, {}, CreateContactInput>, res: Response) => {
    const { name, email, relationship } = req.body;
    const normalizedEmail = email.toLowerCase();

    // 1. Reject self-addition
    const ownerUser = await AuthUser.findById(req.user!.userId);
    if (ownerUser && normalizedEmail === ownerUser.email.toLowerCase()) {
      throw new AppError("You cannot add yourself as a contact", 400);
    }

    // 2. Find or create stub recipient User
    let recipientUser = await AuthUser.findOne({ email: normalizedEmail });
    if (!recipientUser) {
      recipientUser = await AuthUser.create({
        email: normalizedEmail,
        hasOnboarded: false,
        isVerified: false,
        isActive: true,
        lastActiveAt: null,
      });
    }

    // 3. Create UserSharing document, handling unique index duplicates
    try {
      const contact = await UserSharing.create({
        ownerId: req.user!.userId,
        recipientUserId: recipientUser._id,
        name,
        email: normalizedEmail,
        relationship,
      });

      res.status(201).json({
        success: true,
        message: "Contact added successfully",
        data: { contact: toContactResponse(contact) },
      });
    } catch (err: any) {
      if (err.code === 11000 || err.name === "MongoServerError" && err.message?.includes("E11000")) {
        throw new AppError("You've already added this contact", 409);
      }
      throw err;
    }
  }
);


export const listContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await UserSharing.find({ ownerId: req.user!.userId })
    .sort({ createdAt: 1 })
    .exec();

  res.status(200).json({
    success: true,
    message: "Contacts fetched successfully",
    data: {
      contacts: contacts.map(toContactResponse),
    },
  });
});


export const getContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Contact not found", 404);
  }

  const contact = await UserSharing.findOne({
    _id: id,
    ownerId: req.user!.userId,
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Contact fetched successfully",
    data: { contact: toContactResponse(contact) },
  });
});


export const updateContact = asyncHandler(
  async (
    req: Request<import("express-serve-static-core").ParamsDictionary, {}, UpdateContactInput>,
    res: Response
  ) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Contact not found", 404);
    }

    const updates: Record<string, unknown> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.relationship !== undefined) updates.relationship = req.body.relationship;

    const updated = await UserSharing.findOneAndUpdate(
      { _id: id, ownerId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError("Contact not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: { contact: toContactResponse(updated) },
    });
  }
);


export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Contact not found", 404);
  }

  const deleted = await UserSharing.findOneAndDelete({
    _id: id,
    ownerId: req.user!.userId,
  });

  if (!deleted) {
    throw new AppError("Contact not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
  });
});
