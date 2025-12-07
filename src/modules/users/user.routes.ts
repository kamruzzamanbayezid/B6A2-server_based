import { Router } from "express";
import { userControllers } from "./user.controllers";
import isAdmin from "../../middleware/isAdmin";
import isAdminOrOwn from "../../middleware/isAdminOrOwn";

const router = Router();

router.get("/", isAdmin("admin"), userControllers.getAllUser);
router.put(
  "/:userId",
  isAdmin(),
  isAdminOrOwn(),
  userControllers.updateUserById
);

export const userRoutes = router;
