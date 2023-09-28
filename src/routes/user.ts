import express from "express";
import { User } from "../controller/User";
import { validateToken } from "./validate-token";

const router = express.Router();

const user = new User();

router.post("/login", user.loginUser);
router.post("/create", user.createUser);
router.get("/me", validateToken, user.personalProfile);
export default router;
