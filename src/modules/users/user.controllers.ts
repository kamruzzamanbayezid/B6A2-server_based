import { Request, Response } from "express";
import { userServices } from "./user.services";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();

    return res.status(201).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

export const userControllers = {
  getAllUser,
};
