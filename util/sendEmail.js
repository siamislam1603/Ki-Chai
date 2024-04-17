import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

export default async function sendEmail({
  to,
  subject,
  html = "",
  username = "",
  msg = "",
}) {
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
    html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${process.env.BRAND_NAME}</a>
      </div>
      <p style="font-size:1.1em">Hi ${username},</p>
      <p>Thank you for choosing ${process.env.BRAND_NAME}. ${msg}</p>
      ${html}
      <p style="font-size:0.9em;">Regards,<br />${process.env.BRAND_NAME}</p>
    </div>
  </div>
  `,
  });
}
