"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access Denied" });
    }
    try {
        const userVerified = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = userVerified;
        next();
    }
    catch (error) {
        console.error("erro", error); // Use console.error for errors
        res.status(401).json({ error: "Access Denied" });
    }
};
exports.validateToken = validateToken;
