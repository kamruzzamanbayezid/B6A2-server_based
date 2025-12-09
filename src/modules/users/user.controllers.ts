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

const updateUserById = async (req: Request, res: Response) => {
  const id = req?.params?.userId;
  try {
    const result = await userServices.updateUserById(id as string, req.body);
    res.status(200).json({
      success: true,
      message: `User updated successfully`,
      data: result?.rows[0],
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error?.message,
    });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  const id = req?.params?.userId;
  try {
    const result = await userServices.deleteUserById(id as string);

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
export const userControllers = {
  getAllUser,
  updateUserById,
  deleteUserById,
};
