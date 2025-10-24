import nodemailer from 'nodemailer';
import {logger} from './logger';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_ENABLE_SSL,
} = process.env;

const port = Number(SMTP_PORT ?? 587);
const enableSsl = (SMTP_ENABLE_SSL ?? 'false').toLowerCase() === 'true';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.gmail.com',
  port,
  secure: port === 465,
  auth: SMTP_USER && SMTP_PASS ? {user: SMTP_USER || "01632142865a@gmail.com", pass: SMTP_PASS || "ytbgoukygtprveby"} : undefined,
  requireTLS: enableSsl && port !== 465,
  tls: enableSsl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});

export interface MailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export const sendMail = async (options: MailOptions): Promise<void> => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    logger.warn('SMTP credentials missing; skipping email send');
    return;
  }

  const mailOptions = {
    from: options.from ?? `"BMG Shop" <${SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Failed to send email', error as Error);
    throw error;
  }
};
