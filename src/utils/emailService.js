const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
  },
});

// Send verification email with OTP
const sendVerificationEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Verify Your Email - OpenChatX',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .header p {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .otp-container {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #667eea;
          }
          .otp-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .otp-code {
            font-size: 48px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          .expiry {
            margin-top: 15px;
            font-size: 14px;
            color: #999;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning p {
            color: #856404;
            font-size: 14px;
            margin: 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #6c757d;
            font-size: 14px;
            margin: 5px 0;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 OpenChatX</h1>
            <p>Connect. Chat. Collaborate.</p>
          </div>
          
          <div class="content">
            <p class="greeting">Hi <strong>${name}</strong>,</p>
            
            <p class="message">
              Welcome to <strong>OpenChatX</strong>! We're excited to have you on board. 
              To complete your registration and start connecting with friends, please verify your email address.
            </p>
            
            <div class="otp-container">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏰ Valid for 10 minutes</div>
            </div>
            
            <p class="message">
              Simply enter this code on the verification page to activate your account and unlock all features:
            </p>
            
            <ul style="color: #666; line-height: 2; margin-left: 20px;">
              <li>Real-time messaging with friends</li>
              <li>HD video calling</li>
              <li>File sharing & media</li>
              <li>And much more!</li>
            </ul>
            
            <div class="divider"></div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong> If you didn't create an account with OpenChatX, please ignore this email. Your security is our priority.</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>Contact our support team at <a href="mailto:support@openchatx.com" style="color: #667eea;">support@openchatx.com</a></p>
            
            <div class="divider"></div>
            
            <p style="color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} OpenChatX. All rights reserved.<br>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

Welcome to OpenChatX!

Your verification code is: ${otp}

This code will expire in 10 minutes.

Please enter this code on the verification page to complete your registration.

If you didn't create an account, please ignore this email.

Best regards,
The OpenChatX Team

© ${new Date().getFullYear()} OpenChatX. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after successful verification
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🎉 Welcome to OpenChatX - You\'re All Set!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header { 
            background: linear-gradient(135deg, #42d392 0%, #647eff 100%);
            padding: 50px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .header .emoji {
            font-size: 64px;
            margin-bottom: 20px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            color: #666;
            line-height: 1.8;
            margin-bottom: 30px;
          }
          .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
          }
          .feature-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            transition: transform 0.3s;
          }
          .feature-icon {
            font-size: 40px;
            margin-bottom: 10px;
          }
          .feature-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }
          .feature-desc {
            font-size: 13px;
            color: #666;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 16px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          }
          .tips {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .tips h3 {
            color: #1976D2;
            font-size: 18px;
            margin-bottom: 15px;
          }
          .tips ul {
            color: #555;
            line-height: 2;
            margin-left: 20px;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            color: #6c757d;
            font-size: 14px;
            margin: 5px 0;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emoji">🎉</div>
            <h1>Welcome to OpenChatX!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 18px;">Your account is now active</p>
          </div>
          
          <div class="content">
            <p class="greeting">Hey ${name}! 👋</p>
            
            <p class="message">
              Congratulations! Your email has been verified and your OpenChatX account is now fully activated. 
              You're ready to experience seamless communication like never before!
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://openchatx.vercel.app'}" class="cta-button">
                🚀 Start Chatting Now
              </a>
            </div>
            
            <div class="divider"></div>
            
            <h2 style="color: #333; font-size: 22px; margin-bottom: 20px; text-align: center;">
              ✨ What You Can Do
            </h2>
            
            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon">💬</div>
                <div class="feature-title">Real-Time Chat</div>
                <div class="feature-desc">Instant messaging with typing indicators</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">📹</div>
                <div class="feature-title">Video Calls</div>
                <div class="feature-desc">Crystal clear 1:1 video calling</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">👥</div>
                <div class="feature-title">Friend Network</div>
                <div class="feature-desc">Connect with friends easily</div>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">📎</div>
                <div class="feature-title">File Sharing</div>
                <div class="feature-desc">Share photos, videos & docs</div>
              </div>
            </div>
            
            <div class="tips">
              <h3>💡 Quick Tips to Get Started</h3>
              <ul>
                <li><strong>Complete Your Profile:</strong> Add a profile picture and bio</li>
                <li><strong>Find Friends:</strong> Use the search feature to connect with people</li>
                <li><strong>Start Chatting:</strong> Send your first message and try video calling</li>
                <li><strong>Stay Secure:</strong> Enable two-factor authentication in settings</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p class="message" style="text-align: center;">
              <strong>Need help getting started?</strong><br>
              Check out our <a href="#" style="color: #667eea;">Help Center</a> or reach out to our support team.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Stay Connected</strong></p>
            <p style="margin: 15px 0;">
              <a href="#" style="color: #667eea; margin: 0 10px;">Twitter</a> |
              <a href="#" style="color: #667eea; margin: 0 10px;">Facebook</a> |
              <a href="#" style="color: #667eea; margin: 0 10px;">Instagram</a>
            </p>
            
            <div class="divider"></div>
            
            <p style="color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} OpenChatX. All rights reserved.<br>
              You're receiving this email because you created an account with OpenChatX.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hey ${name}!

Welcome to OpenChatX! 🎉

Your email has been verified and your account is now fully activated.

What You Can Do:
✅ Real-Time Chat - Instant messaging with typing indicators
✅ Video Calls - Crystal clear 1:1 video calling
✅ Friend Network - Connect with friends easily
✅ File Sharing - Share photos, videos & documents

Quick Tips to Get Started:
1. Complete Your Profile - Add a profile picture and bio
2. Find Friends - Use the search feature to connect with people
3. Start Chatting - Send your first message and try video calling
4. Stay Secure - Enable two-factor authentication in settings

Start chatting now: ${process.env.FRONTEND_URL || 'https://openchatx.vercel.app'}

Need help? Contact us at support@openchatx.com

Best regards,
The OpenChatX Team

© ${new Date().getFullYear()} OpenChatX. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email, it's not critical
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"OpenChatX" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔒 Password Reset Request - OpenChatX',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header { 
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 16px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
          }
          .link-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            margin: 20px 0;
            border: 1px solid #dee2e6;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset</h1>
          </div>
          
          <div class="content">
            <p class="message">Hi <strong>${name}</strong>,</p>
            
            <p class="message">
              We received a request to reset your password for your OpenChatX account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="reset-button">Reset Password</a>
            </div>
            
            <p class="message">Or copy and paste this link into your browser:</p>
            
            <div class="link-box">
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </div>
            
            <p class="message">⏰ This link will expire in <strong>1 hour</strong> for security reasons.</p>
            
            <div class="warning">
              <p style="color: #856404; margin: 0;">
                <strong>⚠️ Didn't request this?</strong><br>
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="color: #6c757d; font-size: 14px;">
              © ${new Date().getFullYear()} OpenChatX. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hi ${name},

We received a request to reset your password for your OpenChatX account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email.

Best regards,
The OpenChatX Team

© ${new Date().getFullYear()} OpenChatX. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
