import { Response } from "express";
import { pool } from "../../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";

const registerUser = async (user: Record<string, unknown>) => {
  const { name, email, password, phone, role } = user || {};

  const passToCheckLength = password as string;

  if (passToCheckLength.length < 6) {
    const err = new Error(
      "Password must have at least 6 characters or long"
    ) as any;
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const allowedRoles = ["admin", "customer"];

  if (!allowedRoles.includes(role as string)) {
    const err = new Error(
      "Invalid role. Role must be 'admin' or 'customer'"
    ) as any;
    err.statusCode = 400;
    throw err;
  }

  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );

  delete result?.rows[0]?.password;

  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result?.rows.length === 0) {
    const err = new Error("Invalid credentials.") as any;
    err.statusCode = 400;
    throw err;
  }
  const user = result?.rows[0];

  const matchPassword = await bcrypt.compare(password, user?.password);
  if (!matchPassword) {
    const err = new Error("Invalid credentials.") as any;
    err.statusCode = 400;
    throw err;
  }

  const payload = {
    id: user?.id,
    name: user?.name,
    role: user?.role,
    email: user?.email,
  };
  const token = jwt.sign(payload, config.jwt_secret as string, {
    expiresIn: "7d",
  });

//   console.log("Token: ", token);

  delete result?.rows[0].password;

  return { user: user, token: token };
};

export const authServices = {
  registerUser,
  loginUser,
};
