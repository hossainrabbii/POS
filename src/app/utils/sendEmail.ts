import nodemailer from "nodemailer";

import appConfig from "../appConfig/index.js";

const transporter = nodemailer.createTransport({
  host: appConfig.smtp_host,
  port: Number(appConfig.smtp_port),
  secure: false,

  auth: {
    user: appConfig.smtp_user,
    pass: appConfig.smtp_pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailOptions) => {
  await transporter.sendMail({
    from: `"${appConfig.smtp_app_name}" <${appConfig.smtp_user}>`,
    to,
    subject,
    text,
    html,
  });
};