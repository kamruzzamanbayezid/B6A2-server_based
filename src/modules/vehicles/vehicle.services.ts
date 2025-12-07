import { pool } from "../../database/db";

const createVehicle = async (vehicle: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicle || {};

  const lowerType = type && (type as string).toLowerCase();

  const allowedVehicleType = ["car", "bike", "van", "suv"];
  if (!allowedVehicleType.includes(lowerType as string)) {
    const err = new Error(
      "Invalid type. Type must be 'car', 'bike', 'van' or 'SUV'"
    ) as any;
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      lowerType,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

export const vehicleServices = {
  createVehicle,
};
