const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
});

// Send verification email
const sendVerificationEmail = async (email, name, otp) => {
    const mailOptions = {
        from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - OpenChatX',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #646cff; }
          .otp-box { background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Welcome to OpenChatX!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for registering with OpenChatX. Please use the following OTP to verify your email address:</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <div class="footer">
            <p>© 2025 OpenChatX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hi ${name},\n\nThank you for registering with OpenChatX. Your verification OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - OpenChatX',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { text-align: center; color: #646cff; }
          .button { display: inline-block; padding: 12px 30px; background: #646cff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Password Reset Request</h1>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #646cff;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <div class="footer">
            <p>© 2025 OpenChatX. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
        text: `Hi ${name},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
