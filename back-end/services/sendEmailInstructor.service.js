// sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Use environment variables for sensitive data
const adminEmail = process.env.EMAIL_SERVICE_USER;
const adminPassword = process.env.EMAIL_SERVICE_PASSWORD;

const mailHost = 'smtp.gmail.com';
const mailPort = 587;

const sendMailInstructor = async (from, subject = 'Become Instructor') => {
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
        const htmlContent = createEmailContent(from);

        const options = {
            from: adminEmail,
            to: from,
            subject,
            html: htmlContent,
        };

        await transporter.sendMail(options);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
};

const createEmailContent = (from) => {
    return `
        <h1>Become to instructor</h1>
        <p>Hello, my name is ${from},</p>
        <p>I want become instructor</p>
    `;
};

export default sendMailInstructor;
