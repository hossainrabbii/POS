import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

type JwtExpiresIn =
  `${number}${"s" | "m" | "h" | "d" | "y"}`;

const appConfig = {
  NODE_ENV: process.env.NODE_ENV,

  port: process.env.PORT,

  mongo_db_uri: process.env.MONGODB_URI,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  access_token_secret: process.env.ACCESS_TOKEN_SECRET,

  access_token_limit:
    process.env.ACCESS_TOKEN_LIMIT as JwtExpiresIn,

  refresh_token_secret:
    process.env.REFRESH_TOKEN_SECRET,

  refresh_token_limit:
    process.env.REFRESH_TOKEN_LIMIT as JwtExpiresIn,
};

export default appConfig;