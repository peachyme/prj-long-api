import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  service: "gmail",
  auth: {
    user: "hadjer.messaoudene18@gmail.com",
    pass: "huvi nsgq lakp cfyj",
  },
});

export const sendVerificationEmail = (to: string, verificationLink: string) => {
  const mailOptions = {
    from: '"TypeScript APP 👻" <hadjer.messaoudene19@gmail.com>',
    to,
    subject: 'Email Verification',
    html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = (to: string, resetPasswordLink: string) => {
  const mailOptions = {
    from: '"TypeScript APP 👻" <hadjer.messaoudene19@gmail.com>',
    to,
    subject: 'Reset Password',
    html: `Click the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a>`,
  };

  return transporter.sendMail(mailOptions);
};
