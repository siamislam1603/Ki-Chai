export const generateVerifyAccountParams = (user) => {
  // confirm-email link
  const url = `${process.env.FRONTEND_BASE_URL}/verify/?user_id=${user._id}&token=${user.account_verify_token}`;

  const msg = `Use the following OTP to complete your Sign Up procedures. OTP is valid for ${
    +process.env.OTP_EXPIRATION / 60000
  } minutes`;

  const html = `
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px; margin-bottom:20px;">${user.otp}</h2>
  <div style="border-radius: 6px; background-color:#1a82e2; text-align:center; margin:0 auto; width:200px;">
    <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm Email</a>
  </div>
  `;

  return {
    to: user.email,
    subject: "Verify Ki-Chai Account",
    html,
    username: [user.first_name, user.last_name].join(" "),
    msg,
  };
};

export const generateResetPasswordVerificationParams = (user) => {
  // confirm-email link
  const url = `${process.env.FRONTEND_BASE_URL}/reset-password/?user_id=${user._id}&token=${user.reset_password_token}`;

  const msg = `Click the button the reset your password. This link is valid for ${
    +process.env.OTP_EXPIRATION / 60000
  } minutes`;

  const html = `
  <div style="border-radius: 6px; background-color:#1a82e2; text-align:center; margin:0 auto; width:200px;">
    <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
  </div>
  `;

  return {
    to: user.email,
    subject: "Ki-Chai Reset Password Verification",
    html,
    username: [user.first_name, user.last_name].join(" "),
    msg,
  };
};
