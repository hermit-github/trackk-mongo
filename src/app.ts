import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes";
import { apiErrorHandler, handleNotFound } from "./utils";
import { authenticate, logger } from "./middlewares";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

app.use("/api/users", userRouter);
app.use(authenticate)
app.use("/api/health", (req,res) => {
    res.status(200).json({ status: "ok" , message: "Server is healthy" });
});

app.use(handleNotFound);
app.use(apiErrorHandler)

export default app;

