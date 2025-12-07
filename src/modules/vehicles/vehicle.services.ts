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

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getVehicleById = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicleById = async (
  id: string,
  reqBody: Record<string, unknown>
) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);

  if (result.rows.length === 0) {
    const err = new Error("Vehicle is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const responseVehicle = result?.rows[0];

  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = reqBody || {};

  const updated_vehicle_name = vehicle_name || responseVehicle?.vehicle_name;
  const updated_type = type || responseVehicle?.type;
  const updated_registration_number =
    registration_number || responseVehicle?.registration_number;
  const updated_daily_rent_price =
    daily_rent_price || responseVehicle?.daily_rent_price;
  const updated_availability_status =
    availability_status || responseVehicle?.availability_status;

  const result1 = await pool.query(
    `
      UPDATE vehicles 
      SET 
        vehicle_name = $1,
        type = $2,
        registration_number = $3,
        daily_rent_price = $4,
        availability_status = $5
      WHERE id = $6 
      RETURNING *;
    `,
    [
      updated_vehicle_name,
      updated_type,
      updated_registration_number,
      updated_daily_rent_price,
      updated_availability_status,
      id,
    ]
  );
  return result1;
};

const deleteVehicleById = async (id: string) => {
  const checkExisting = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    id,
  ]);

  const isVehicleExist = checkExisting.rows[0];

  if (!isVehicleExist) {
    const err = new Error("Vehicle is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  if (isVehicleExist.availability_status === "booked") {
    const err = new Error(
      "Cannot delete vehicle. Active bookings exist!"
    ) as any;
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
