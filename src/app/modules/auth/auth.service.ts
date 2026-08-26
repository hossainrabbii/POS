import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../user/user.model.js";

import type {
  IAuthResponse,
  ILoginPayload,
  IRegisterPayload,
} from "./auth.interface.js";
import appConfig from "../../appConfig/index.js";

const createAccessToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    appConfig.access_token_secret as string,
    {
      expiresIn: appConfig.access_token_limit,
    }
  );
};

const createRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    appConfig.refresh_token_secret as string,
    {
      expiresIn: appConfig.refresh_token_limit,
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
    throw new Error(
      "User with this email already exists"
    );
  }

  const saltRounds = Number(
    appConfig.bcrypt_salt_rounds
  );

  const hashedPassword = await bcrypt.hash(
    payload.password,
    saltRounds
  );

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: "OWNER",
    status: "ACTIVE",
  });

  const accessToken = createAccessToken(
    user._id.toString()
  );

  const refreshToken = createRefreshToken(
    user._id.toString()
  );

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
    throw new Error(
      "Invalid email or password"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new Error(
      "Your account is inactive"
    );
  }

  const passwordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!passwordMatched) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const accessToken = createAccessToken(
    user._id.toString()
  );

  const refreshToken = createRefreshToken(
    user._id.toString()
  );

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
      appConfig.refresh_token_secret as string
    ) as {
      userId: string;
    };

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new Error(
        "Your account is inactive"
      );
    }

    const accessToken = createAccessToken(
      user._id.toString()
    );

    return {
      accessToken,
    };
  } catch {
    throw new Error(
      "Invalid or expired refresh token"
    );
  }
};