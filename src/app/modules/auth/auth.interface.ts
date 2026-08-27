export interface IRegisterPayload {
  name: string;

  email: string;

  password: string;
}

export interface IVerifyEmailPayload {
  email: string;

  otp: string;
}

export interface ILoginPayload {
  email: string;

  password: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IVerifyResetOtpPayload {
  email: string;

  otp: string;
}

export interface IResetPasswordPayload {
  resetToken: string;

  password: string;
}