import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import productRouter from "./routes/product";
import dashboardRouter from "./routes/dashboard";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/product", productRouter);
app.use("/api/dashboards", dashboardRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("test");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
