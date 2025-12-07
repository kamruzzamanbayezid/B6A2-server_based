import { NextFunction, Request, Response } from "express";

const isAdminOrOwn = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const loggedUser = req?.user;

    const paramsId = Number(req?.params?.userId);
    const reqId = Number(loggedUser?.id);

    if (loggedUser?.role === "admin") {
      return next();
    } else if (reqId === paramsId) {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden access!",
      });
    }
  };
};

export default isAdminOrOwn;
