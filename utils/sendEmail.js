import nodemailer from "nodemailer";

export default async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "ec45013b9d8232",
      pass: "2880da19d0baac",
    },
  });

  const options = {
    from: "Therapy Admin <admin@therapy.com>",
    to: mailOptions.email,
    subject: mailOptions.subject,
    text: mailOptions.message,
  };

  await transporter.sendMail(options);
};
