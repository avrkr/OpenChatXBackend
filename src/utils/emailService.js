const nodemailer = require('nodemailer');

// Check if email credentials are configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;
};

// Create transporter using Gmail SMTP
const createTransport = () => {
  if (!isEmailConfigured()) {
    console.warn('⚠️ Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 5000, // 5 seconds timeout
    greetingTimeout: 5000,
    socketTimeout: 5000
  });
};

// -------------------------
// SEND VERIFICATION EMAIL
// -------------------------
const sendVerificationEmail = async (email, name, otp) => {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured. OTP:', otp, 'for', email);
    return;
  }

  const transporter = createTransport();

  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Verify Your Email - OpenChatX',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px;">
          <h2 style="text-align:center; color:#667eea;">OpenChatX Email Verification</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Welcome to OpenChatX! Use the OTP below to verify your email:</p>

          <div style="background: #eef1ff; padding: 20px; text-align:center; border-radius: 8px; margin: 20px 0;">
            <h1 style="letter-spacing: 8px; color:#667eea;">${otp}</h1>
            <p style="color:#777;">Valid for 10 minutes</p>
          </div>

          <p>If you didn't request this email, you can safely ignore it.</p>
          <p style="color:#aaa; font-size:12px; text-align:center; margin-top:30px;">
            © ${new Date().getFullYear()} OpenChatX
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

Welcome to OpenChatX!

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't create an account, ignore this message.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
  } catch (err) {
    console.error('❌ Error sending verification email:', err.message);
    // Don't throw - allow registration to continue even if email fails
    console.log('⚠️ Registration will continue without email. OTP:', otp);
  }
};

// -------------------------
// SEND WELCOME EMAIL
// -------------------------
const sendWelcomeEmail = async (email, name) => {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured. Welcome email skipped for', email);
    return;
  }

  const transporter = createTransport();

  const frontend = process.env.FRONTEND_URL || "https://openchatx.vercel.app";

  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Welcome to OpenChatX, ${name}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; background: #f5f7fa; padding: 20px;">
        <div style="max-width: 600px; margin:auto; background:white; padding:30px; border-radius:12px;">
          <h1 style="text-align:center; color:#42d392;">🎉 Welcome, ${name}!</h1>
          <p>Your account is now active. You can start chatting immediately.</p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${frontend}" style="
              background: #667eea;
              padding: 15px 30px;
              border-radius: 50px;
              color: white;
              text-decoration: none;
              font-size: 16px;">
              Start Chatting 🚀
            </a>
          </div>

          <p>Need help? Email us at support@openchatx.com</p>

          <p style="color:#aaa; font-size:12px; text-align:center; margin-top:30px;">
            © ${new Date().getFullYear()} OpenChatX
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Hey ${name}!

Your OpenChatX account is now active. Start chatting here:
${frontend}

Need help? Contact support@openchatx.com
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (err) {
    console.error('❌ Error sending welcome email:', err);
  }
};

// -------------------------
// SEND PASSWORD RESET EMAIL
// -------------------------
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured. Password reset email skipped for', email);
    return;
  }

  const transporter = createTransport();

  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔒 Reset Your Password - OpenChatX',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; background:#f4f4f4; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:12px;">
          <h2>Password Reset Request</h2>
          <p>Hi <strong>${name}</strong>,</p>

          <p>Click the button below to reset your password:</p>

          <div style="text-align:center; margin:20px 0;">
            <a href="${resetUrl}" style="
              background:#ee5a6f;
              padding:15px 35px;
              color:white;
              border-radius:50px;
              text-decoration:none;">
              Reset Password 🔒
            </a>
          </div>

          <p>If the button doesn't work, copy this link:</p>
          <p style="word-break:break-all; color:#555;">${resetUrl}</p>

          <p>⏰ This link expires in 1 hour.</p>

          <p style="color:#aaa; font-size:12px; text-align:center; margin-top:30px;">
            © ${new Date().getFullYear()} OpenChatX
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

Click the link below to reset your password:
${resetUrl}

This link expires in 1 hour.

If you didn't request this, ignore the email.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
  } catch (err) {
    console.error('❌ Error sending password reset email:', err);
    throw new Error('Failed to send password reset email');
  }
};

// EXPORTS
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
