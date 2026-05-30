import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const createTransport = () => {
  if (!env.smtp.host || !env.smtp.user) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
};

export const sendMail = async ({ to, subject, html }) => {
  const transport = createTransport();

  if (!transport) {
    console.log(`[mail:dev] ${subject} -> ${to}`);
    return;
  }

  await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html
  });
};
