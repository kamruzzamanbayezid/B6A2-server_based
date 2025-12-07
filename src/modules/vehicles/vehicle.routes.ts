import { Router } from "express";
import { vehicleControllers } from "./vehicle.controllers";
import isAdmin from "../../middleware/isAdmin";

const router = Router();

router.post("/", isAdmin("admin"), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:vehicleId", vehicleControllers.getVehicleById);
router.put("/:vehicleId", isAdmin("admin"), vehicleControllers.updateVehicleById);
router.delete(
  "/:vehicleId",
  isAdmin("admin"),
  vehicleControllers.deleteVehicleById
);

export const vehicleRoutes = router;
