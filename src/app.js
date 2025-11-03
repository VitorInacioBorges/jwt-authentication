// configures express and exports all routes and middlewares.

import express from "express";
import user_routes from "./routes/user_routes.js";
import error_middleware from "./middlewares/error_middleware.js";

const app = express();

app.use(express.json());
app.use("/api", user_routes);
app.use(error_middleware);

export default app;
