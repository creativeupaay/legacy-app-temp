import { Router } from "express";
import { protect } from "../../auth/middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { createEntrySchema, updateEntrySchema } from "../validators/journal.validator";
import * as journalController from "../controllers/journal.controller";

const router = Router();

// Every journal route requires a logged-in user
router.use(protect());

router.post("/", validate(createEntrySchema), journalController.createEntry);

// query params are validated inside listEntries via listEntriesQuerySchema
router.get("/", journalController.listEntries);

router.get("/memories", journalController.listMemories);
router.get("/:id", journalController.getEntry);
router.patch("/:id", validate(updateEntrySchema), journalController.updateEntry);
router.delete("/:id", journalController.deleteEntry);

export default router;
