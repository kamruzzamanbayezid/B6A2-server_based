import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({ connectionString: config.connection_string });

const initializeDb = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(10) NOT NULL
        );
    `);

  await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS lower_users_email_idx ON users (lower(email));
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(150) NOT NULL,
            type VARCHAR(10) NOT NULL,
            registration_number VARCHAR(50) NOT NULL UNIQUE,
            daily_rent_price DECIMAL(10, 2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(10) DEFAULT 'available'
        );
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id),
            vehicle_id INT NOT NULL REFERENCES vehicles(id),
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL CHECK (total_price > 0),
            status VARCHAR(10) NOT NULL,
            
            CHECK (rent_end_date >= rent_start_date)
        );
    `);
};

export default initializeDb;
