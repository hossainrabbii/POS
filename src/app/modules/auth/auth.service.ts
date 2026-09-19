import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import appConfig from "../../appConfig/index.js";
import { sendEmail } from "../../utils/sendEmail.js";

import { User } from "../user/user.model.js";

import { Otp } from "./otp.model.js";
import { Session } from "./session.model.js";

import type { ILoginPayload, IRegisterPayload } from "./auth.interface.js";
import type { IUserRole } from "../user/user.interface.js";

// ======================================================
// OTP HELPERS
// ======================================================

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashValue = (value: string): string => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const getOtpExpirationDate = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

// ======================================================
// JWT
// ======================================================

const createAccessToken = (userId: string, role: IUserRole): string => {
  return jwt.sign(
    {
      userId,
      role,
    },

    appConfig.access_token_secret,

    {
      expiresIn: appConfig.access_token_limit as NonNullable<
        jwt.SignOptions["expiresIn"]
      >,
    },
  );
};
const createRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    },
    appConfig.refresh_token_secret,

    {
      expiresIn: appConfig.refresh_token_limit as NonNullable<
        jwt.SignOptions["expiresIn"]
      >,
    },
  );
};

// ======================================================
// REFRESH TOKEN EXPIRATION DATE
// ======================================================

const getRefreshTokenExpirationDate = (): Date => {
  const limit = appConfig.refresh_token_limit;

  const match = limit.match(/^(\d+)([smhdy])$/);

  if (!match) {
    throw new Error("Invalid refresh token expiration format");
  }

  const value = Number(match[1]);

  const unit = match[2];

  const millisecondsMap: Record<"s" | "m" | "h" | "d" | "y", number> = {
    s: 1000,

    m: 60 * 1000,

    h: 60 * 60 * 1000,

    d: 24 * 60 * 60 * 1000,

    y: 365 * 24 * 60 * 60 * 1000,
  };

  if (
    unit !== "s" &&
    unit !== "m" &&
    unit !== "h" &&
    unit !== "d" &&
    unit !== "y"
  ) {
    throw new Error("Invalid refresh token expiration unit");
  }

  return new Date(Date.now() + value * millisecondsMap[unit]);
};

// ======================================================
// REGISTER
// ======================================================

export const registerUser = async (payload: IRegisterPayload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("An account already exists with this email");
  }

  const passwordHash = await bcrypt.hash(
    password,
    Number(appConfig.bcrypt_salt_rounds),
  );

  const otp = generateOtp();

  const otpHash = hashValue(otp);

  await Otp.findOneAndUpdate(
    {
      email,
      purpose: "EMAIL_VERIFICATION",
    },

    {
      email,

      otpHash,

      purpose: "EMAIL_VERIFICATION",

      expiresAt: getOtpExpirationDate(),

      attempts: 0,

      name,

      passwordHash,
    },

    {
      upsert: true,

      new: true,
    },
  );

  await sendEmail({
    to: email,
    subject: "Verify Your POS Account",
    text: `Your verification code is ${otp}. This code will expire in 10 minutes. If you didn't create an account, please ignore this email.`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="480px" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
                  
                  <!-- Header Branding -->
                  <tr>
                    <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                      <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 700; letter-spacing: -0.025em;">POS System</h2>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px; text-align: center;">
                      <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Verify Your Account</h3>
                      <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 14px; line-height: 20px;">
                        Thank you for registering. Please use the verification code below to activate your account:
                      </p>

                      <!-- OTP Box -->
                      <div style="margin: 0 auto 24px auto; padding: 16px 24px; background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 6px; display: inline-block;">
                        <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827;">${otp}</span>
                      </div>

                      <!-- Expiry Warning -->
                      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                        This code will expire in <strong style="color: #6b7280;">10 minutes</strong>.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                        &copy; ${new Date().getFullYear()} POS System. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return {
    message: "Verification OTP sent to your email",
  };
};

// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = async (email: string, otp: string) => {
  const otpRecord = await Otp.findOne({
    email,
    purpose: "EMAIL_VERIFICATION",
  });

  if (!otpRecord) {
    throw new Error("OTP not found or expired");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("OTP has expired");
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("Too many incorrect OTP attempts");
  }

  const otpHash = hashValue(otp);

  if (otpHash !== otpRecord.otpHash) {
    await Otp.updateOne(
      {
        _id: otpRecord._id,
      },

      {
        $inc: {
          attempts: 1,
        },
      },
    );

    throw new Error("Invalid OTP");
  }

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("An account already exists with this email");
  }

  // These two fields are required
  // for registration.
  if (!otpRecord.name || !otpRecord.passwordHash) {
    throw new Error("Registration information is missing");
  }

  const user = await User.create({
    name: otpRecord.name,

    email,

    password: otpRecord.passwordHash,

    role: "OWNER",

    status: "ACTIVE",
  });

  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      status: user.status,
    },
  };
};

// ======================================================
// LOGIN
// ======================================================

export const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is inactive");
  }

  const accessToken = createAccessToken(user._id.toString(), user.role);

  const refreshToken = createRefreshToken(user._id.toString());

  await Session.create({
    userId: user._id,

    refreshToken,

    expiresAt: getRefreshTokenExpirationDate(),
  });

  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,

      status: user.status,
    },

    accessToken,

    refreshToken,
  };
};

// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

export const refreshAccessToken = async (refreshToken: string) => {
  let decoded: {
    userId: string;
  };

  try {
    decoded = jwt.verify(
      refreshToken,

      appConfig.refresh_token_secret,
    ) as {
      userId: string;
    };
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const session = await Session.findOne({
    refreshToken,

    userId: decoded.userId,
  });

  if (!session) {
    throw new Error("Session not found or already logged out");
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await Session.deleteOne({
      _id: session._id,
    });

    throw new Error("Refresh token has expired");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is inactive");
  }

  const accessToken = createAccessToken(user._id.toString(), user.role);

  return {
    accessToken,
  };
};

// ======================================================
// LOGOUT
// ======================================================

export const logoutUser = async (refreshToken: string) => {
  await Session.deleteOne({
    refreshToken,
  });
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({
    email,
  });

  // Don't reveal whether
  // the email exists.
  if (!user) {
    return {
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    };
  }
  const otp = generateOtp();

  const otpHash = hashValue(otp);

  await Otp.findOneAndUpdate(
    {
      email,
      purpose: "PASSWORD_RESET",
    },

    {
      email,
      otpHash,
      purpose: "PASSWORD_RESET",
      expiresAt: getOtpExpirationDate(),
      attempts: 0,
    },

    {
      upsert: true,
      new: true,
    },
  );

  await sendEmail({
    to: email,
    subject: "Password Reset Request - POS System",
    text: `Your password reset code is ${otp}. This code will expire in 10 minutes. If you didn't request this, please ignore this email.`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="480px" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
                  
                  <!-- Header Branding -->
                  <tr>
                    <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #f3f4f6;">
                      <h2 style="margin: 0; color: #111827; font-size: 20px; font-weight: 700; letter-spacing: -0.025em;">POS System</h2>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 32px; text-align: center;">
                      <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: 600;">Password Reset Request</h3>
                      <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 14px; line-height: 20px;">
                        We received a request to reset your password. Use the verification code below to proceed:
                      </p>

                      <!-- OTP Box -->
                      <div style="margin: 0 auto 24px auto; padding: 16px 24px; background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 6px; display: inline-block;">
                        <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827;">${otp}</span>
                      </div>

                      <!-- Expiry Warning -->
                      <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                        This code will expire in <strong style="color: #6b7280;">10 minutes</strong>.
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6;">
                      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                        &copy; ${new Date().getFullYear()} POS System. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return {
    message:
      "If an account exists with this email, a password reset OTP has been sent.",
  };
};

// ======================================================
// VERIFY RESET OTP
// ======================================================

export const verifyResetOtp = async (email: string, otp: string) => {
  const otpRecord = await Otp.findOne({
    email,
    purpose: "PASSWORD_RESET",
  });

  if (!otpRecord) {
    throw new Error("OTP not found or expired");
  }

  if (otpRecord.expiresAt.getTime() < Date.now()) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("OTP has expired");
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    throw new Error("Too many incorrect OTP attempts");
  }

  const otpHash = hashValue(otp);

  if (otpHash !== otpRecord.otpHash) {
    await Otp.updateOne(
      {
        _id: otpRecord._id,
      },

      {
        $inc: {
          attempts: 1,
        },
      },
    );

    throw new Error("Invalid OTP");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = hashValue(resetToken);

  const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.updateOne(
    {
      _id: otpRecord._id,
    },

    {
      $set: {
        resetTokenHash,

        resetTokenExpiresAt,
      },
    },
  );

  return {
    resetToken,
  };
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (
  resetToken: string,
  newPassword: string,
) => {
  const resetTokenHash = hashValue(resetToken);

  const otpRecord = await Otp.findOne({
    purpose: "PASSWORD_RESET",

    resetTokenHash,

    resetTokenExpiresAt: {
      $gt: new Date(),
    },
  });

  if (!otpRecord) {
    throw new Error("Invalid or expired reset token");
  }

  const user = await User.findOne({
    email: otpRecord.email,
  }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,

    Number(appConfig.bcrypt_salt_rounds),
  );

  user.password = hashedPassword;

  await user.save();

  // Delete the used reset OTP.
  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  // Log out all existing sessions
  // after password change.
  await Session.deleteMany({
    userId: user._id,
  });
};
