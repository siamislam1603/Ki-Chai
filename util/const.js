import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const getMimeTypeValidationMsg = (validTypes) => {
  const validExtensions = validTypes.map(
    (item) => "." + item.substring(item.lastIndexOf("/") + 1)
  );
  if (validExtensions.length > 1) {
    const lastExtension = validExtensions.pop();
    return [validExtensions.join(", "), lastExtension].join(" or ");
  }
  return validExtensions.join(", ");
};

export const fieldNames = Object.freeze({
  GYM_CLASS: "gym_classes",
  REGISTER: "register",
});

export const mailTransporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
