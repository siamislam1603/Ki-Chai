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

export const generateOTP = () => {
  const digits = "0123456789";
  const limit = 6;
  let OTP = "";
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return +OTP;
};

export const deSelectUserColumns =
  "-password -otp -account_verify_token -account_verify_token_expiration -reset_password_token_expiration -reset_password_token";
