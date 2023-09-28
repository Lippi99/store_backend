import express from "express";
import { validateToken } from "./validate-token";
import { Dashboard } from "../controller/Dashboard";

const router = express.Router();

const dashboard = new Dashboard();

router.get("/filtered", validateToken, dashboard.mostSoldProducts);
router.get("/allyear", validateToken, dashboard.totalOfEachMonth);

export default router;
