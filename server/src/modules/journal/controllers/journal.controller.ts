import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import Journal from "../models/journal.model";
import { IJournalEntryDocument, IEntryResponse } from "../types/journal.types";
import {
  CreateEntryInput,
  UpdateEntryInput,
  listEntriesQuerySchema,
} from "../validators/journal.validator";


function toEntryResponse(doc: IJournalEntryDocument): IEntryResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    textBody: doc.textBody,
    privacy: doc.privacy,
    sharedWith: doc.sharedWith.map((id) => id.toString()),
    entryDate: doc.entryDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}


export const createEntry = asyncHandler(
  async (req: Request<{}, {}, CreateEntryInput>, res: Response) => {
    const { title, textBody, privacy, sharedWith, entryDate } = req.body;

    const entry = await Journal.create({
      ownerId: req.user!.userId,
      title,
      textBody,
      privacy,
      sharedWith: (sharedWith ?? []).map((id) => new mongoose.Types.ObjectId(id)),
      entryDate: entryDate ? new Date(entryDate) : undefined, // defaults to Date.now via schema
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

  const { page, limit, privacy } = queryResult.data;

  const filter: Record<string, unknown> = { ownerId: req.user!.userId };
  if (privacy) filter.privacy = privacy;

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

  const entry = await Journal.findOne({
    _id: id,
    ownerId: req.user!.userId,
  });

  if (!entry) {
   
    throw new AppError("Entry not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Journal entry fetched",
    data: { entry: toEntryResponse(entry) },
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
