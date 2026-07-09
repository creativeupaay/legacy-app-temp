import { Router } from "express";
import { protect } from "../../auth/middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
  createFolderSchema,
  updateFolderSchema,
  deleteFolderSchema,
} from "../validators/journalFolder.validator";
import {
  createFolder,
  listFolders,
  getFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/journalFolder.controller";

const router = Router();

router.use(protect());

router.post("/", validate(createFolderSchema), createFolder);
router.get("/", listFolders);
router.get("/:id", getFolder);
router.patch("/:id", validate(updateFolderSchema), updateFolder);
router.delete("/:id", validate(deleteFolderSchema), deleteFolder);

export default router;
