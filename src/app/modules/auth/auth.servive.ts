import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



import { User } from "../user/user.model.js";
import type { IAuthResponse, ILoginPayload, IRegisterPayload } from "./auth.interface.js";
import appConfig from "../../appConfig/index.js";


const SALT_ROUNDS = 10;

const createAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    appConfig.jwt_access_secret,
    {
      expiresIn: appConfig.jwt_access_expires_in as jwt.SignOptions["expiresIn"],
    }
  );
};

const createRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

export const registerUser = async (
  payload: IRegisterPayload
): Promise<IAuthResponse> => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    SALT_ROUNDS
  );

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: "OWNER",
    status: "ACTIVE",
  });

  const accessToken = createAccessToken(user._id.toString());

  const refreshToken = createRefreshToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (
  payload: ILoginPayload
): Promise<IAuthResponse> => {
  const user = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is inactive");
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const accessToken = createAccessToken(user._id.toString());

  const refreshToken = createRefreshToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (
  refreshToken: string
) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      env.jwtRefreshSecret
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Your account is inactive");
    }

    const accessToken = createAccessToken(
      user._id.toString()
    );

    return {
      accessToken,
    };
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};