import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../services/prisma";
export class User {
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!userExists) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      return bcrypt.compare(password, userExists.password).then((result) => {
        if (result) {
          const token = jwt.sign(
            {
              id: userExists.id,
              name: userExists.name,
              email: userExists.email,
            },
            process.env.SECRET_KEY as string,
            {
              expiresIn: 86400,
              noTimestamp: true,
            }
          );
          const authData = {
            id: userExists.id,
            email: userExists.email,
            name: userExists.name,
          };

          const { name, email, id } = authData;
          res.header("doceifancia.auth", token);
          return res.status(200).json({ name, email, id, token });
        } else {
          return res.status(400).json({ error: "User or password invalid" });
        }
      });
    } catch (error) {}
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const salt = bcrypt.genSaltSync(14);

    try {
      const userAlreadyExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userAlreadyExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      await prisma.user.create({
        data: {
          name,
          email,
          password: bcrypt.hashSync(password, salt),
        },
      });

      return res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async personalProfile(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      return jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        async (authorization, secretToken: any) => {
          try {
            const retrieveUser = await prisma.user.findMany({
              where: {
                email: secretToken.email,
              },
            });

            res.status(200).json(retrieveUser[0]);
          } catch (error) {
            res.status(404).json({ error: "User not found" });
          }
        }
      );
    } else {
      res.status(404).send("erro");
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
