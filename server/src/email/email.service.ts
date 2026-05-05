import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodeMailer.Transporter;

    constructor(private readonly config: ConfigService) {
        this.transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.config.get<string>('MAIL_USER'),
                pass: this.config.get<string>('APP_PASSWORD'),
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"My App" <${this.config.get<string>('MAIL_USER') || 'your-email@gmail.com'}>`,
                to,
                subject,
                text,
                html,
            });
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    getOtpTemplate(otp: string) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .header { background: #2c3e50; color: #ffffff; padding: 20px; text-align: center; }
                .content { padding: 40px; text-align: center; color: #333333; }
                .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #3498db; margin: 20px 0; padding: 15px; background: #f0f8ff; border-radius: 4px; display: inline-block; }
                .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; }
                .btn { display: inline-block; padding: 10px 20px; background: #3498db; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verification Code</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for choosing our platform. Please use the following One-Time Password (OTP) to complete your registration:</p>
                    <div class="otp-code">${otp}</div>
                    <p>This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} My App. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}
