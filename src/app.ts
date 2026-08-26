import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "POS Server is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(globalErrorHandler);

export default app;