import nodemailer from "nodemailer";

export function sendNotification(
  referrerName: string,
  refereeName: string,
  refereeEmail: string,
  courseName: string
) {
  const user = process.env.EMAIL_USER,
    pass = process.env.EMAIL_PASS;
  console.log({ user, pass });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const subject = "Your Friend Referred You to a Course!";
  const htmlBody = `
   <h1>You've Been Referred to a Course!</h1>
    <p>Dear ${refereeName},</p>
    <p>We are excited to inform you that your friend, ${referrerName}, has referred you to our course, <strong>${courseName}</strong>.</p>
    <p>Here's a personal message from ${referrerName}:</p>
    <p>This course offers valuable insights and skills that can help you achieve your goals. We believe you will find it both enjoyable and beneficial.</p>
    <p>If you have any questions or need further information, feel free to reach out to us.</p>
    <p>Best Regards,<br>Your Company Name</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: refereeEmail,
    subject,
    text: htmlBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
