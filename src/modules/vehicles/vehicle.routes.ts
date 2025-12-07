import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";

const router = Router();

router.post("/", vehicleControllers.createVehicle);

export const vehicleRoutes = router;
