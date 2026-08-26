import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";


import authRouter from "./app/modules/auth/auth.route.js"
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POS server is running",
  });
});

app.use(
  "/api/auth",
  authRouter
);

app.use(globalErrorHandler);

export default app;