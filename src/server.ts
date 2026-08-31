import mongoose from "mongoose";

import app from "./app.js";
import appConfig from "./app/appConfig/index.js";

const PORT = appConfig.port || 5000;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(appConfig.mongo_db_uri as string);
    console.log("🛢 Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

connectToDatabase();
