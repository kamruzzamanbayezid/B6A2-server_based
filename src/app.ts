import express, { Request, Response } from "express";
import { Pool } from "pg";
import { config } from "./config";
import initializeDb from "./database/db";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

export const app = express();

app.use(express.json());

// initialize DB
initializeDb();

// auth route
app.use("/api/v1/auth", authRoutes);

// Vehicles route
app.use("/api/v1/vehicles", vehicleRoutes);

// users route
app.use("/api/v1/users", userRoutes);

// booking routes
app.use("/api/v1/bookings", bookingRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello From B6A1 of Programming Hero L2");
});
