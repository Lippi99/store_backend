"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controller/User");
const validate_token_1 = require("./validate-token");
const router = express_1.default.Router();
const user = new User_1.User();
router.post("/login", user.loginUser);
router.post("/create", user.createUser);
router.get("/me", validate_token_1.validateToken, user.personalProfile);
exports.default = router;
