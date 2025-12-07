import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router();

router.post("/signup", authControllers.registerUser);
router.post("/signin", authControllers.loginUser);

export const authRoutes = router;
