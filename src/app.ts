import express, { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "./config";
import initializeDb from "./database/db";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";

export const app = express();

app.use(express.json());

// initialize DB
initializeDb();

// Vehicles route
app.use("/api/v1/vehicles", vehicleRoutes);

// auth route
app.use("/api/v1/auth", authRoutes);

// users route
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From B6A1 of Programming Hero L2");
});
