import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import router from "./app/routes/index.js";
const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POS server is running",
  });
});

app.use(globalErrorHandler);

export default app;
