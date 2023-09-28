"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../controller/Auth");
const router = express_1.default.Router();
const user = new Auth_1.User();
router.post("/login", user.loginUser);
router.post("/create", user.createUser);
exports.default = router;
