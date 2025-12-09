import { pool } from "../../database/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  result.rows.forEach((user) => {
    delete user?.password;
  });
  return result;
};

const updateUserById = async (id: string, reqBody: Record<string, unknown>) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  if (result.rows.length === 0) {
    const err = new Error("User is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const responseUser = result?.rows[0];

  const { name, email, phone, role } = reqBody || {};

  const updated_name = name || responseUser?.vehicle_name;
  const updated_email = email || responseUser?.email;
  const updated_phone = phone || responseUser?.phone;
  const updated_role = role || responseUser?.role;

  const result1 = await pool.query(
    `
      UPDATE users 
      SET 
        name = $1,
        email = $2,
        phone = $3,
        role = $4
      WHERE id = $5 
      RETURNING *;
    `,
    [updated_name, updated_email, updated_phone, updated_role, id]
  );
  delete result1.rows[0].password;
  return result1;
};

const deleteUserById = async (id: string) => {
  const checkExisting = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    id,
  ]);

  const user = checkExisting.rows[0];

  if (!user) {
    const err = new Error("User is not found!!") as any;
    err.statusCode = 400;
    throw err;
  }

  const isActiveBooking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  const isActiveCount = isActiveBooking?.rowCount ?? 0;

  if (isActiveCount > 0) {
    const err = new Error(
      "Can not delete user. This user has active booking"
    ) as any;
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUser,
  updateUserById,
  deleteUserById,
};
