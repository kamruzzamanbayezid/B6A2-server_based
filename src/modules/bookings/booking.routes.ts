import { Router } from "express";
import { bookingControllers } from "./booking.controllers";
import isAdmin from "../../middleware/isAdmin";
import isAdminOrOwn from "../../middleware/isAdminOrOwn";

const router = Router();

router.post(
  "/",
  isAdmin("admin", "customer"),
  bookingControllers.createBooking
);
router.get("/", isAdmin(), bookingControllers.getAllBookings);
router.put("/:bookingId", isAdmin(), bookingControllers.updateBookingById);

export const bookingRoutes = router;
