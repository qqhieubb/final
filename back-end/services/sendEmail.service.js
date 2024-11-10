// sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Use environment variables for sensitive data
const adminEmail = process.env.EMAIL_SERVICE_USER;
const adminPassword = process.env.EMAIL_SERVICE_PASSWORD;

const mailHost = 'smtp.gmail.com';
const mailPort = 587;

const sendMail = async (to, subject = 'Payment Confirmation', paymentAmount) => {
    try {
        const transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: false,
            auth: {
                user: adminEmail,
                pass: adminPassword,
            },
        });
        const htmlContent = createEmailContent(to, paymentAmount);

        const options = {
            from: adminEmail,
            to,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(options);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

const createEmailContent = (userName, paymentAmount) => {
    return `
        <h1>Payment Information</h1>
        <p>Hello ${userName},</p>
        <p>Thank you for your purchase. Here are the details:</p>
        <p><strong>Amount Due:</strong> ${paymentAmount} VND</p>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br>Your Service Team</p>
    `;
};

// Example usage of the function
const userEmail = 'recipient@example.com';
const userName = 'Nguyen Van A';
const paymentAmount = '500,000'; // Example payment amount


export default sendMail;
