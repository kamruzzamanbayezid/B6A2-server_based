import cron from "node-cron";
import { pool } from "../database/db";

export const autoReturnExpiredBookings = async () => {
  const updatedBookings = await pool.query(
    `UPDATE bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date < CURRENT_TIMESTAMP RETURNING *`
  );

  const updateCount = updatedBookings.rowCount ?? 0;

  if (updateCount > 0) {
    const vehicleIds = updatedBookings.rows.map((row) => row.vehicle_id);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = ANY($1::int[])`,
      [vehicleIds]
    );
  }
};

export const startBookingScheduler = () => {
  cron.schedule("0 0 * * *", autoReturnExpiredBookings);
};
