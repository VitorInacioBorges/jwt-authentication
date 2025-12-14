import express from "express";
import userRoutes from "../routes/user_routes.js";
import errorMiddleware from "../middlewares/error_middleware.js";

const app = express();
app.use(express.json());
app.use("/api", userRoutes);
app.use(errorMiddleware);

export { app };
