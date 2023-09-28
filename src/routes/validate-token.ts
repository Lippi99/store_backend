import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

export const validateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }

  try {
    const userVerified = jwt.verify(token, process.env.SECRET_KEY as string);

    req.user = userVerified;

    next();
  } catch (error) {
    console.error("erro", error); // Use console.error for errors
    res.status(401).json({ error: "Access Denied" });
  }
};
