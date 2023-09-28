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
exports.Product = void 0;
const prisma_1 = require("../services/prisma");
const Token_1 = require("./Token");
class Product {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token_1.Token();
            const { quantity, price, productName, materialPrice, commission, labor } = req.body;
            const profit = price - materialPrice - commission - labor;
            const userToken = yield token.getToken(req, res);
            if (!userToken)
                return res.status(400).json({ error: "Invalid token" });
            const product = {
                userId: userToken.id,
                quantity: Number(quantity),
                productName: productName,
                price: Number(price) * Number(quantity),
                materialPrice: Number(materialPrice) * Number(quantity),
                commission: Number(commission) * Number(quantity),
                labor: Number(labor) * Number(quantity),
                profit: Number(profit) * Number(quantity),
            };
            try {
                yield prisma_1.prisma.product.create({
                    data: product,
                });
                return res.status(201).json({ success: "Product created successfully" });
            }
            catch (error) {
                console.log("ERRO", error);
                return res.status(400).json({ error });
            }
        });
    }
    listProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token_1.Token();
            const { page, size, startDate, endDate } = req.query;
            const parsedPage = Number(page);
            const parsedPageSize = Number(size);
            if (isNaN(parsedPage) || isNaN(parsedPageSize)) {
                return res.status(400).json({ error: "Invalid page or pageSize" });
            }
            const skip = (parsedPage - 1) * parsedPageSize;
            try {
                const gteStart = new Date(startDate);
                const lteEnd = new Date(endDate);
                // Assuming you have a function to extract the user ID from the token
                const userId = yield token.getToken(req, res);
                if (!userId) {
                    return res.status(400).json({ error: "Invalid token" });
                }
                const products = yield prisma_1.prisma.product.findMany({
                    where: {
                        userId: userId.id,
                        createdAt: {
                            gte: gteStart,
                            lte: lteEnd,
                        },
                    },
                    skip,
                    take: parsedPageSize,
                    select: {
                        id: true,
                        userId: true,
                        quantity: true,
                        productName: true,
                        price: true,
                        materialPrice: true,
                        commission: true,
                        labor: true,
                        profit: true,
                        createdAt: true,
                    },
                });
                const hasNextPage = yield prisma_1.prisma.product.findMany({
                    where: {
                        userId: userId.id,
                        createdAt: {
                            gte: gteStart,
                            lte: lteEnd,
                        },
                    },
                    skip: skip + parsedPageSize,
                });
                // Check the number of items in the previous page
                let prevPageItemCount = null;
                if (skip >= parsedPageSize) {
                    const prevPage = yield prisma_1.prisma.product.findMany({
                        where: {
                            userId: userId.id,
                            createdAt: {
                                gte: gteStart,
                                lte: lteEnd,
                            },
                        },
                        skip: skip - parsedPageSize,
                        take: parsedPageSize,
                    });
                    prevPageItemCount = prevPage.length;
                }
                return res.status(200).json({
                    count: yield prisma_1.prisma.product.count(),
                    page: parsedPage,
                    pageSize: parsedPageSize,
                    nextpages: hasNextPage.length ? hasNextPage.length : null,
                    previousPage: prevPageItemCount,
                    data: products,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    listProductByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const product = yield prisma_1.prisma.product.findMany({
                    where: { id },
                });
                if (!product) {
                    return res.status(400).json({ error: "Product not found" });
                }
                return res.status(200).json(product);
            }
            catch (error) {
                return res.status(500).json({ error });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { quantity, price, productName, materialPrice, commission, labor } = req.body;
            const profit = price - materialPrice - commission - labor;
            const body = {
                quantity: Number(quantity),
                productName,
                price: Number(price) * Number(quantity),
                materialPrice: Number(materialPrice) * Number(quantity),
                commission: Number(commission) * Number(quantity),
                labor: Number(labor) * Number(quantity),
                profit: Number(profit) * Number(quantity),
            };
            try {
                const product = yield prisma_1.prisma.product.update({
                    where: { id },
                    data: body,
                });
                if (!product) {
                    return res.status(400).json({ error: "Product not found" });
                }
                return res.status(200).json({ success: "Product updated successfully" });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    listAggregatedProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = new Token_1.Token();
            const { startDate, endDate } = req.query;
            const gteStart = new Date(startDate);
            const lteEnd = new Date(endDate);
            try {
                const user = yield token.getToken(req, res);
                if (!user)
                    return res.status(400).json({ error: "Invalid token" });
                const products = yield prisma_1.prisma.product.aggregate({
                    where: {
                        userId: user.id,
                        createdAt: {
                            gte: gteStart,
                            lte: lteEnd,
                        },
                    },
                    _sum: {
                        price: true,
                        materialPrice: true,
                        commission: true,
                        quantity: true,
                        labor: true,
                        profit: true,
                    },
                });
                const total = {
                    price: products._sum.price,
                    quantity: products._sum.quantity,
                    material: products._sum.materialPrice,
                    commission: products._sum.commission,
                    labor: products._sum.labor,
                    profit: products._sum.profit,
                };
                return res.status(200).json(total);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield prisma_1.prisma.product.delete({
                    where: { id },
                });
                if (!product) {
                    return res.status(400).json({ error: "Product not found" });
                }
                return res.status(200).json({ success: "Product deleted successfully" });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.Product = Product;
