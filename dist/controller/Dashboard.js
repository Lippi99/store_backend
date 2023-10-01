"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const prisma_1 = require("../services/prisma");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const Token_1 = require("./Token");
class Dashboard {
    mostSoldProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token_1.Token();
            const { startDate, endDate } = req.query;
            try {
                const gteStart = new Date(startDate);
                const lteEnd = new Date(endDate);
                if (!gteStart || !lteEnd) {
                    return res.status(400).json({ error: "Invalid date format" });
                }
                const user = yield token.getToken(req, res);
                if (!user)
                    return res.status(400).json({ error: "Invalid token" });
                const products = yield prisma_1.prisma.product.findMany({
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
                const productsName = products.map((product) => (Object.assign(Object.assign({}, product), { _id: product.productName })));
                return res.status(200).json(productsName);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    totalOfEachMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token_1.Token();
            try {
                const user = yield token.getToken(req, res);
                if (!user)
                    return res.status(400).json({ error: "Invalid token" });
                const products = yield prisma_1.prisma.product.findMany({
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
                const totalByMonthYear = products.reduce((acc, product) => {
                    const createdAt = product.createdAt;
                    const year = createdAt.getFullYear();
                    const month = (0, date_fns_1.format)(new Date(year, createdAt.getMonth() + 1, 1), "MMMM", { locale: locale_1.pt });
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
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.Dashboard = Dashboard;
