import mongoose from "mongoose";

import app from "./app.js";
import appConfig from "./app/appConfig/index.js";

const PORT = appConfig.port || 5000;

const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(appConfig.mongo_db_uri as string);
      console.log("🛢 Database connected successfully");
    }

    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Local development
if (process.env.NODE_ENV !== "production") {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

// Vercel/serverless
export default async function handler(req: any, res: any) {
  await connectToDatabase();

  return app(req, res);
}