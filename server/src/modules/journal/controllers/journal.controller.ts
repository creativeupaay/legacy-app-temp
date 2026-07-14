import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import Journal from "../models/journal.model";
import { IJournalEntryDocument, IEntryResponse, EntryPrivacy } from "../types/journal.types";
import {
  CreateEntryInput,
  UpdateEntryInput,
  listEntriesQuerySchema,
} from "../validators/journal.validator";
import JournalFolder from "../../journalFolder/models/journalFolder.model";
import AuthUser from "../../auth/models/authuser.model";
import UserSharing from "../../userSharing/models/userSharing.model";

function toEntryResponse(doc: IJournalEntryDocument, authorDetails?: any): IEntryResponse {
  return {
    id: doc._id.toString(),
    ownerId: doc.ownerId.toString(),
    title: doc.title,
    textBody: doc.textBody,
    privacy: doc.privacy,
    sharedWith: doc.sharedWith.map((id) => id.toString()),
    entryDate: doc.entryDate,
    folderId: doc.folderId ? doc.folderId.toString() : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    author: authorDetails,
  };
}

export const createEntry = asyncHandler(
  async (req: Request<{}, {}, CreateEntryInput>, res: Response) => {
    const { title, textBody, privacy, sharedWith, entryDate, folderId } =
      req.body;

    let validFolderId: mongoose.Types.ObjectId | null = null;
    if (folderId && folderId !== "null") {
      if (!mongoose.isValidObjectId(folderId)) {
        throw new AppError("Invalid folder ID", 400);
      }
      const folder = await JournalFolder.findOne({
        _id: folderId,
        ownerId: req.user!.userId,
      });
      if (!folder) {
        throw new AppError("Invalid or unauthorized folder ID", 400);
      }
      validFolderId = new mongoose.Types.ObjectId(folderId);
    }

    const entry = await Journal.create({
      ownerId: req.user!.userId,
      title,
      textBody,
      privacy,
      sharedWith: (sharedWith ?? []).map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
      entryDate: entryDate ? new Date(entryDate) : undefined,
      folderId: validFolderId,
    });

    res.status(201).json({
      success: true,
      message: "Journal entry created",
      data: { entry: toEntryResponse(entry) },
    });
  }
);


export const listEntries = asyncHandler(async (req: Request, res: Response) => {
  const queryResult = listEntriesQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    throw new AppError(
      "Invalid query parameters",
      400,
      "INVALID_QUERY",
      queryResult.error.flatten().fieldErrors
    );
  }

  const { page, limit, privacy, folderId } = queryResult.data;

  const filter: Record<string, unknown> = { ownerId: req.user!.userId };
  if (privacy) filter.privacy = privacy;
  if (folderId !== undefined) {
    if (folderId === null || folderId === "null") {
      filter.folderId = null;
    } else if (mongoose.isValidObjectId(folderId)) {
      filter.folderId = new mongoose.Types.ObjectId(folderId);
    }
  }

  const [entries, total] = await Promise.all([
    Journal.find(filter)
      .sort({ entryDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IJournalEntryDocument[]>(),
    Journal.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Journal entries fetched",
    data: {
      entries: entries.map(toEntryResponse),
      page,
      limit,
      total,
    },
  });
});


export const getEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Entry not found", 404);
  }

  const entry = await Journal.findById(id);

  if (!entry) {
    throw new AppError("Entry not found", 404);
  }

  const isOwner = entry.ownerId.toString() === req.user!.userId;
  let authorDetails: any = undefined;

  if (!isOwner) {
    // Check if the owner is triggered
    const owner = await AuthUser.findById(entry.ownerId);
    if (!owner || owner.trigger.status !== "triggered") {
      throw new AppError("Entry not found", 404);
    }

    // Check if shared with the logged-in user
    const sharingRecord = await UserSharing.findOne({
      ownerId: entry.ownerId,
      recipientUserId: req.user!.userId,
    });

    if (!sharingRecord) {
      throw new AppError("Entry not found", 404);
    }

    if (entry.privacy === EntryPrivacy.SHARED_SPECIFIC) {
      const isShared = entry.sharedWith.some(
        (shareId) => shareId.toString() === sharingRecord._id.toString()
      );
      if (!isShared) {
        throw new AppError("Entry not found", 404);
      }
    } else if (entry.privacy !== EntryPrivacy.SHARED_ALL) {
      throw new AppError("Entry not found", 404);
    }

    authorDetails = {
      fullName: owner.fullName || "",
      avatar: owner.avatar || null,
      email: owner.email,
      relationship: sharingRecord.relationship || "",
    };
  }

  res.status(200).json({
    success: true,
    message: "Journal entry fetched",
    data: { entry: toEntryResponse(entry, authorDetails) },
  });
});


export const updateEntry = asyncHandler(
  async (req: Request<import('express-serve-static-core').ParamsDictionary, {}, UpdateEntryInput>, res: Response) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Entry not found", 404);
    }

    const updates: Record<string, unknown> = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.textBody !== undefined) updates.textBody = req.body.textBody;
    if (req.body.privacy !== undefined) updates.privacy = req.body.privacy;
    if (req.body.sharedWith !== undefined) updates.sharedWith = req.body.sharedWith;
    if (req.body.entryDate !== undefined) updates.entryDate = new Date(req.body.entryDate);
    if (req.body.folderId !== undefined) {
      if (req.body.folderId && req.body.folderId !== "null") {
        if (!mongoose.isValidObjectId(req.body.folderId)) {
          throw new AppError("Invalid folder ID", 400);
        }
        const folder = await JournalFolder.findOne({
          _id: req.body.folderId,
          ownerId: req.user!.userId,
        });
        if (!folder) {
          throw new AppError("Invalid or unauthorized folder ID", 400);
        }
        updates.folderId = new mongoose.Types.ObjectId(req.body.folderId);
      } else {
        updates.folderId = null;
      }
    }

   
    const updated = await Journal.findOneAndUpdate(
      { _id: id, ownerId: req.user!.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError("Entry not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Journal entry updated",
      data: { entry: toEntryResponse(updated) },
    });
  }
);


export const deleteEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Entry not found", 404);
  }

  const deleted = await Journal.findOneAndDelete({
    _id: id,
    ownerId: req.user!.userId,
  });

  if (!deleted) {
    throw new AppError("Entry not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Journal entry deleted",
  });
});

export const listMemories = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  // 1. Find all sharing connections where current user is the recipient
  const sharingConnections = await UserSharing.find({ recipientUserId: userId });

  if (sharingConnections.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Legacy memories fetched",
      data: { entries: [] },
    });
  }

  // 2. Map sharing connections by ownerId
  const ownerIds = sharingConnections.map((conn) => conn.ownerId);

  // 3. Find which of these owners are currently triggered
  const triggeredUsers = await AuthUser.find({
    _id: { $in: ownerIds },
    "trigger.status": "triggered",
  }).select("fullName avatar email");

  if (triggeredUsers.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Legacy memories fetched",
      data: { entries: [] },
    });
  }

  const triggeredUserMap = new Map<string, typeof triggeredUsers[0]>();
  for (const u of triggeredUsers) {
    triggeredUserMap.set(u._id.toString(), u);
  }

  // Filter connections to only those from triggered owners
  const activeTriggeredConnections = sharingConnections.filter((conn) =>
    triggeredUserMap.has(conn.ownerId.toString())
  );

  const activeTriggeredOwnerIds = activeTriggeredConnections.map((conn) => conn.ownerId);
  const activeTriggeredSharingIds = activeTriggeredConnections.map((conn) => conn._id);

  // 4. Fetch the journal entries
  const entries = await Journal.find({
    ownerId: { $in: activeTriggeredOwnerIds },
    $or: [
      { privacy: EntryPrivacy.SHARED_ALL },
      {
        privacy: EntryPrivacy.SHARED_SPECIFIC,
        sharedWith: { $in: activeTriggeredSharingIds },
      },
    ],
  })
    .sort({ entryDate: -1 })
    .lean<IJournalEntryDocument[]>();

  // Map each connection to its details
  const connectionMap = new Map<string, typeof activeTriggeredConnections[0]>();
  for (const conn of activeTriggeredConnections) {
    connectionMap.set(conn._id.toString(), conn);
    // Also map by ownerId as a fallback or for shared_all
    connectionMap.set(`owner-${conn.ownerId.toString()}`, conn);
  }

  const enrichedEntries = entries.map((entry) => {
    const ownerIdStr = entry.ownerId.toString();
    const owner = triggeredUserMap.get(ownerIdStr)!;

    let relationship = "";
    if (entry.privacy === EntryPrivacy.SHARED_SPECIFIC) {
      // Find the specific connection matching the sharedWith ID
      const matchingSharingId = entry.sharedWith.find((id) =>
        connectionMap.has(id.toString())
      );
      if (matchingSharingId) {
        relationship = connectionMap.get(matchingSharingId.toString())?.relationship || "";
      }
    } else {
      relationship = connectionMap.get(`owner-${ownerIdStr}`)?.relationship || "";
    }

    const authorDetails = {
      fullName: owner.fullName || "",
      avatar: owner.avatar || null,
      email: owner.email,
      relationship,
    };

    return toEntryResponse(entry, authorDetails);
  });

  res.status(200).json({
    success: true,
    message: "Legacy memories fetched",
    data: {
      entries: enrichedEntries,
    },
  });
});
