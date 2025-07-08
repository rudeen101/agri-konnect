import nodemailer from "nodemailer"

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // Use 587 for STARTTLS or 465 for SSL
        secure: false, // Set to 'true' if using port 465
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Agri-Konnect:" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    });

    console.log(`Email sent to ${to}: ${subject}`);
};

export default sendEmail;
