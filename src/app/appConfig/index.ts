import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const appConfig = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  port: getRequiredEnv("PORT"),
  mongo_db_uri: getRequiredEnv("MONGODB_URI"),
  bcrypt_salt_rounds: getRequiredEnv("BCRYPT_SALT_ROUNDS"),
  access_token_secret: getRequiredEnv("ACCESS_TOKEN_SECRET"),
  access_token_limit: getRequiredEnv("ACCESS_TOKEN_LIMIT"),
  refresh_token_secret: getRequiredEnv("REFRESH_TOKEN_SECRET"),
  refresh_token_limit: getRequiredEnv("REFRESH_TOKEN_LIMIT"),
  smtp_host: getRequiredEnv("SMTP_HOST"),
  smtp_port: getRequiredEnv("SMTP_PORT"),
  smtp_user: getRequiredEnv("SMTP_USER"),
  smtp_pass: getRequiredEnv("SMTP_PASS"),
  smtp_app_name: getRequiredEnv("SMTP_APP_NAME"),
};

export default appConfig;
