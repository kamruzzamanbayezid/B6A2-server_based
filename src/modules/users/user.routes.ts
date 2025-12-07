import { Router } from "express";
import { userControllers } from "./user.controllers";
import { auth } from "../../middleware/auth";

const router = Router();

router.get("/", auth("admin","customer"), userControllers.getAllUser);

export const userRoutes = router;
