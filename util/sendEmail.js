import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

export default async function sendEmail({to,subject,text}) {
  const mailTransporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    })
  );
  await mailTransporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
}
