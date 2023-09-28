import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Token } from "./Token";

export class Dashboard {
  async mostSoldProducts(req: Request, res: Response) {
    const token = new Token();
    const { startDate, endDate } = req.query;

    try {
      const gteStart = new Date(startDate as string);
      const lteEnd = new Date(endDate as string);

      if (!gteStart || !lteEnd) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const user = await token.getToken(req, res);
      if (!user) return res.status(400).json({ error: "Invalid token" });

      const products = await prisma.product.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: gteStart,
            lte: lteEnd,
          },
        },
        select: {
          productName: true,
          quantity: true,
          price: true,
        },
      });

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async totalOfEachMonth(req: Request, res: Response) {
    const token = new Token();

    try {
      const user = await token.getToken(req, res);
      if (!user) return res.status(400).json({ error: "Invalid token" });

      const products = await prisma.product.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            createdAt: "asc",
          },
        ],
        select: {
          createdAt: true,
          profit: true,
        },
      });

      if (!products || !products.length) {
        return res.status(400).json({ error: "No products found" });
      }

      const totalByMonthYear: {
        [key: string]: {
          year: number;
          month: number;
          total: number;
        };
      } = products.reduce((acc, product) => {
        const createdAt = product.createdAt as Date;
        const year = createdAt.getFullYear();
        const month = format(
          new Date(year, createdAt.getMonth() + 1, 1),
          "MMMM",
          { locale: pt }
        );

        const monthCapitalize = month.charAt(0).toUpperCase() + month.slice(1);

        const yearMonth = `${year}-${month}`;
        if (!acc[yearMonth]) {
          acc[yearMonth] = {
            month: monthCapitalize,
            total: 0,
            _id: {
              month: createdAt.getMonth() + 2,
              year,
            },
          };
          acc[yearMonth].total += product.profit;
        }
        return acc;
      }, {});

      const totalOfEachMonth = Object.values(totalByMonthYear);

      return res.status(200).json(totalOfEachMonth);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
