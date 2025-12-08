import { Request } from "express";
import { pool } from "../../database/db";

const createBooking = async (booking: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    booking || {};

  const customer = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    customer_id,
  ]);

  if (!customer?.rows?.length) {
    const err = new Error("User is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (!vehicle?.rows?.length) {
    const err = new Error("Vehicle is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const availability_status = vehicle.rows[0].availability_status;

  if (availability_status !== "available") {
    const err = new Error("Vehicle is not available for rent!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const overlapping = await pool.query(
    `
      SELECT * 
      FROM bookings
      WHERE vehicle_id = $1
        AND NOT (
            rent_end_date < $2 OR 
            rent_start_date > $3
        );
    `,
    [vehicle_id, rent_start_date, rent_end_date]
  );

  if (overlapping.rows.length > 0) {
    const err: any = new Error("Vehicle is already booked for these dates!");
    err.statusCode = 400;
    throw err;
  }

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  if (start >= end) {
    const err: any = new Error("Start date must be earlier than end date");
    err.statusCode = 400;
    throw err;
  }

  const daily_rent_price = vehicle?.rows[0].daily_rent_price;

  const timeDiff = end.getTime() - start.getTime();
  const days = timeDiff / (1000 * 60 * 60 * 24);
  const total_price = Number(daily_rent_price) * days;

  const result = await pool.query(
    `
      INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *;
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [
    "booked",
    vehicle_id,
  ]);

  return { result: result?.rows[0], vehicle: vehicle?.rows[0] };
};

const getAllBookings = async (user: Record<string, unknown>) => {
  const result = await pool.query(`SELECT * FROM bookings`);
  return result;
};

const updateBookingById = async (req: Request) => {
  const bookingId = req.params?.bookingId;
  const { status } = req.body;
  const user = req?.user;

  const hasBooking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (hasBooking?.rows?.length === 0) {
    const err = new Error("Booking is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const booking = hasBooking.rows[0];

  if (user?.role === "customer") {
    if (status !== "cancelled") {
      const err = new Error("Customers can only cancel bookings") as any;
      err.statusCode = 400;
      throw err;
    }

    if (booking?.customer_id !== user?.id) {
      const err = new Error("Unauthorized Access") as any;
      err.statusCode = 403;
      throw err;
    }

    const currentDate = new Date();
    const startDate = new Date(booking?.rent_start_date);

    if (currentDate > startDate) {
      const err = new Error("You can only cancel before start date") as any;
      err.statusCode = 400;
      throw err;
    }

    

    console.log(currentDate.getTime());
    console.log(startDate.getTime());
  }
};

export const bookingServices = {
  createBooking,
  getAllBookings,
  updateBookingById,
};
