import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    return res.status(201).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  const id = req?.params?.vehicleId;
  try {
    const result = await vehicleServices.getVehicleById(id as string);
    return res.status(200).json({
      success: true,
      message: `Vehicle retrieved successfully`,
      data: result?.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const updateVehicleById = async (req: Request, res: Response) => {
  const id = req?.params?.vehicleId;
  try {
    const result = await vehicleServices.updateVehicleById(
      id as string,
      req.body
    );
    res.status(200).json({
      success: true,
      message: `Vehicle updated successfully`,
      data: result?.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error?.message,
    });
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  const id = req?.params?.vehicleId;
  try {
    const result = await vehicleServices.deleteVehicleById(id as string);

    if (result?.rowCount === 0) {
      return res.status(500).json({
        success: false,
        message: "Something wrong! check if the user us exists or not..",
      });
    }

    res.status(201).json({
      success: true,
      message: `User deleted successfully`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};
