import nodemailer from "nodemailer";

// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
  try {
    // Create a transporter with your SMTP configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    console.log("base url", process.env.BASE_URL);

    // Send mail with defined transport object
    await transporter.sendMail({
      from: "Your E-kart <tosha2030@outlook.com>",
      to: email,
      subject: "Email Verification",
      text: `Click on the following link to verify your email: ${process.env.BASE_URL}/verify-email/${verificationToken}`,
      html: `
    <div>
      <h3>Verify your email</h3>
      <p>Welcome to E-kart!!</p>
      <p>Click on the button to verify your email:</p>
      <button style="background-color: #e4e4e7; border-radius: 10px; border-color: #020617; padding: 5px; "><a href="${process.env.BASE_URL}/verify-email/${verificationToken}" style="color: black; text-decoration-line: none; font-weight: 700; ">Verify Email</a></button>
    </div>
  `,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export default sendVerificationEmail;
