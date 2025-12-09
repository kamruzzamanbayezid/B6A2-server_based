import cron from "node-cron";
import { pool } from "../database/db";

export const autoReturnExpiredBookings = async () => {
  const updatedBookings = await pool.query(
    `UPDATE bookings SET status = 'returned' WHERE status = 'active' RETURNING *`
  );
  console.log("COunt", updatedBookings.rowCount);

  const updateCount = updatedBookings.rowCount ?? 0;

  if (updateCount > 0) {
    const vehicleIds = updatedBookings.rows.map((row) => row.vehicle_id);
    console.log("Vehicke id: ", vehicleIds);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = ANY($1::int[])`,
      [vehicleIds]
    );

    console.log("Returned:", updateCount, "bookings");
  }
};

export const startBookingScheduler = () => {
  cron.schedule("0 0 * * *", autoReturnExpiredBookings);
};
