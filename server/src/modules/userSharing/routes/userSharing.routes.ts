import { Router } from "express";
import { protect } from "../../auth/middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { createContactSchema, updateContactSchema } from "../validators/userSharing.validator";
import * as userSharingController from "../controllers/userSharing.controller";

const router = Router();

router.use(protect());

router.post("/", validate(createContactSchema), userSharingController.createContact);
router.get("/", userSharingController.listContacts);
router.get("/:id", userSharingController.getContact);
router.patch("/:id", validate(updateContactSchema), userSharingController.updateContact);
router.delete("/:id", userSharingController.deleteContact);

export default router;
