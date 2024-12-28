import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import { router as userRouter } from "./routes/user.routes.js";
app.use("/users", userRouter);

export default app;
