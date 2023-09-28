"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = require("../controller/Product");
const validate_token_1 = require("./validate-token");
const router = express_1.default.Router();
const product = new Product_1.Product();
router.post("/create", validate_token_1.validateToken, product.createProduct);
router.get("/total", validate_token_1.validateToken, product.listAggregatedProducts);
router.get("", validate_token_1.validateToken, product.listProducts);
router.get("/:id", validate_token_1.validateToken, product.listProductByID);
router.patch("/:id", validate_token_1.validateToken, product.updateProduct);
router.delete("/:id", validate_token_1.validateToken, product.deleteProduct);
exports.default = router;
