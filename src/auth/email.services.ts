import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodemailerService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Your SMTP server hostname
            port: 587, // Your SMTP server port
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'jairaj.mongooseintern@gmail.com', // Your email address
                pass: 'ynfzffrnlcrnwvpz' // Your email password
            }
        });
    }

    async sendWelcomeEmail(email: string, username: string): Promise<void> {
        const htmlContent = `
            <html>
            <head>
                <style>
                    /* Styles for email */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        background-color: #007bff;
                        color: #ffffff;
                        padding: 10px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Your App!</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${username},</p>
                        <p>Welcome to Your App! We are excited to have you on board.</p>
                    </div>
                    <div class="footer">
                        <p>Thank you,</p>
                        <p>The Ecommerce App Team</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        try {
            await this.transporter.sendMail({
                from: "jairaj.mongooseintern@gmail.com",
                to: email,
                subject: 'Welcome to Your App!',
                text: `Hello ${username},\n\nWelcome to Your App! We are excited to have you on board.`,
                 html: htmlContent//`<p>Hello ${username},</p><p>Welcome to Your App! We are excited to have you on board.</p>`
            });
            console.log('Welcome email sent successfully');
        } catch (error) {
            console.error('Error sending welcome email:', error);
            throw error;
        }
    }

    async sendEmailToChangePassword(email: string, resetLink: string): Promise<string> {
        const htmlContent = `
            <html>
            <body>
                <p>Hello,</p>
                <p>You have requested a password reset. Please click the link below to reset your password:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>If you did not request this, please ignore this email.</p>
            </body>
            </html>
        `;

        try {
           const mail =  await this.transporter.sendMail({
                from: 'jairaj.mongooseintern@gmail.com',
                to: email,
                subject: 'Password Reset Request',
                html: htmlContent
            });
            console.log(mail);
           
            return 'Password reset email sent successfully';
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }
}
