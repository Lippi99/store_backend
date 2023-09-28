import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { User } from "@prisma/client";
import { prisma } from "../services/prisma";
export class Token {
  async getToken(req: Request, res: Response) {
    // Get user id from jwt token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(
      token as string,
      process.env.SECRET_KEY as string
    );
    const user = decoded as User;

    try {
      const id = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!id) {
        throw new Error("Invalid token");
      }
      return user;
    } catch (error) {}
  }
}
