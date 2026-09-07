import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";
import router from "./app/routes/index.js";
import cors from 'cors';
const app = express();

app.use(express.json());

// Enable CORS for your Next.js frontend
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // Required for cookies/tokens if passed via headers/credentials
  })
);
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POS server is running",
  });
});

app.use(globalErrorHandler);

export default app;
