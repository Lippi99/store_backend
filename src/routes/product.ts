import express from "express";
import { Product } from "../controller/Product";
import { validateToken } from "./validate-token";

const router = express.Router();

const product = new Product();

router.post("/create", validateToken, product.createProduct);
router.get("/total", validateToken, product.listAggregatedProducts);
router.get("", validateToken, product.listProducts);
router.get("/:id", validateToken, product.listProductByID);
router.patch("/:id", validateToken, product.updateProduct);
router.delete("/:id", validateToken, product.deleteProduct);

export default router;
