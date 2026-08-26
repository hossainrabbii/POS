import mongoose from "mongoose";
import app from "./app.js";
import appConfig from "./app/appConfig/index.js";

const PORT = process.env.PORT || 5000;

async function connectToDatabase() {
  try {
    await mongoose.connect(appConfig.mongo_db_uri as string);

    console.log("🛢 Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

connectToDatabase();