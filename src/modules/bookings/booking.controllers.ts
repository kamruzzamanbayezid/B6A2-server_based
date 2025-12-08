import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.result,
        vehicle: {
          vehicle_name: result?.vehicle?.vehicle_name,
          daily_rent_price: result?.vehicle?.daily_rent_price,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings(req?.user);

    return res.status(201).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const updateBookingById = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.updateBookingById(req);
    res.status(200).json({
      success: true,
      message: `Booking updated successfully`,
      // data: result?.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error?.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBookingById,
};
