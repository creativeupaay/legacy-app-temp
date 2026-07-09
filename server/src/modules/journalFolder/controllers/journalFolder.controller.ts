import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../../../utils/asyncHandler";
import AppError from "../../../utils/appError";
import JournalFolder from "../models/journalFolder.model";
import Journal from "../../journal/models/journal.model";
import {
  IJournalFolderDocument,
  IFolderResponse,
} from "../types/journalFolder.types";
import {
  CreateFolderInput,
  UpdateFolderInput,
  DeleteFolderInput,
} from "../validators/journalFolder.validator";

function toFolderResponse(
  doc: IJournalFolderDocument,
  journalCount: number = 0
): IFolderResponse {
  return {
    id: doc._id.toString(),
    name: doc.name,
    icon: doc.icon,
    color: doc.color,
    journalCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const createFolder = asyncHandler(
  async (req: Request<{}, {}, CreateFolderInput>, res: Response) => {
    const { name, icon, color } = req.body;
    const ownerId = req.user!.userId;

    // Case-insensitive check for duplicate folder name
    const existing = await JournalFolder.findOne({
      ownerId,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existing) {
      throw new AppError("A folder with this name already exists", 400);
    }

    const folder = await JournalFolder.create({
      ownerId,
      name: name.trim(),
      icon: icon.trim(),
      color: color.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Journal folder created",
      data: { folder: toFolderResponse(folder, 0) },
    });
  }
);

export const listFolders = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = new mongoose.Types.ObjectId(req.user!.userId);

  // Single MongoDB aggregation pipeline grouped by folderId to avoid N+1 queries
  const counts = await Journal.aggregate([
    {
      $match: {
        ownerId,
      },
    },
    {
      $group: {
        _id: "$folderId",
        journalCount: {
          $sum: 1,
        },
      },
    },
  ]);

  const countMap = new Map<string, number>();
  counts.forEach((item) => {
    const key = item._id ? item._id.toString() : "null";
    countMap.set(key, item.journalCount || 0);
  });

  const folders = await JournalFolder.find({ ownerId }).sort({ createdAt: 1 });

  // Virtual "All Entries" folder at the top (folderId = null)
  const allEntriesFolder: IFolderResponse = {
    id: null,
    name: "All Entries",
    icon: "BookOpen",
    color: "#182232",
    journalCount: countMap.get("null") || 0,
  };

  const customFolders = folders.map((folder) =>
    toFolderResponse(folder, countMap.get(folder._id.toString()) || 0)
  );

  res.status(200).json({
    success: true,
    message: "Journal folders fetched",
    data: {
      folders: [allEntriesFolder, ...customFolders],
    },
  });
});

export const getFolder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Folder not found", 404);
  }

  const folder = await JournalFolder.findOne({
    _id: id,
    ownerId: req.user!.userId,
  });

  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  const count = await Journal.countDocuments({
    ownerId: req.user!.userId,
    folderId: id,
  });

  res.status(200).json({
    success: true,
    message: "Journal folder fetched",
    data: { folder: toFolderResponse(folder, count) },
  });
});

export const updateFolder = asyncHandler(
  async (
    req: Request<
      import("express-serve-static-core").ParamsDictionary,
      {},
      UpdateFolderInput
    >,
    res: Response
  ) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Folder not found", 404);
    }

    const folder = await JournalFolder.findOne({
      _id: id,
      ownerId: req.user!.userId,
    });

    if (!folder) {
      throw new AppError("Folder not found", 404);
    }

    if (req.body.name && req.body.name.trim() !== folder.name) {
      const duplicate = await JournalFolder.findOne({
        ownerId: req.user!.userId,
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${req.body.name.trim()}$`, "i") },
      });
      if (duplicate) {
        throw new AppError("A folder with this name already exists", 400);
      }
      folder.name = req.body.name.trim();
    }

    if (req.body.icon !== undefined) folder.icon = req.body.icon.trim();
    if (req.body.color !== undefined) folder.color = req.body.color.trim();

    await folder.save();

    const count = await Journal.countDocuments({
      ownerId: req.user!.userId,
      folderId: id,
    });

    res.status(200).json({
      success: true,
      message: "Journal folder updated",
      data: { folder: toFolderResponse(folder, count) },
    });
  }
);

export const deleteFolder = asyncHandler(
  async (
    req: Request<
      import("express-serve-static-core").ParamsDictionary,
      {},
      DeleteFolderInput
    >,
    res: Response
  ) => {
    const { id } = req.params;
    const { action } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Folder not found", 404);
    }

    const folder = await JournalFolder.findOne({
      _id: id,
      ownerId: req.user!.userId,
    });

    if (!folder) {
      throw new AppError("Folder not found", 404);
    }

    if (action === "move_to_all_entries" || action === "move") {
      await Journal.updateMany(
        { ownerId: req.user!.userId, folderId: id },
        { $set: { folderId: null } }
      );
    } else if (action === "delete_all") {
      await Journal.deleteMany({ ownerId: req.user!.userId, folderId: id });
    }

    await JournalFolder.deleteOne({ _id: id, ownerId: req.user!.userId });

    res.status(200).json({
      success: true,
      message: "Journal folder deleted successfully",
    });
  }
);
