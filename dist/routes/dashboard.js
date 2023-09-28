"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_token_1 = require("./validate-token");
const Dashboard_1 = require("../controller/Dashboard");
const router = express_1.default.Router();
const dashboard = new Dashboard_1.Dashboard();
router.get("/filtered", validate_token_1.validateToken, dashboard.mostSoldProducts);
router.get("/allyear", validate_token_1.validateToken, dashboard.totalOfEachMonth);
exports.default = router;
