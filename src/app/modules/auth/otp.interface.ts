export type OtpPurpose = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

export interface IOtp {
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  attempts: number;
  name?: string | undefined;
  passwordHash?: string | undefined;
  resetTokenHash?: string | undefined;
  resetTokenExpiresAt?: Date | undefined;
}
