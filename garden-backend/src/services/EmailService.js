const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Use environment variables for email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    };

    // For development, use console logging (fake SMTP)
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
      console.log('📧 Using development email service (console logs only)');
      this.transporter = {
        sendMail: async (mailOptions) => {
          console.log('\n=== 📧 EMAIL WOULD BE SENT ===');
          console.log('From:', mailOptions.from);
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          console.log('Text Content:');
          console.log(mailOptions.text);
          console.log('=== END EMAIL ===\n');
          return { messageId: 'dev-' + Date.now() };
        }
      };
    } else {
      console.log('📧 Using production email service with SMTP');
      this.transporter = nodemailer.createTransporter(emailConfig);
    }
  }

  // Generate verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  // Generate secure token
  generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send email verification code
  async sendEmailVerification(email, code, userName = 'User') {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Community Gardens" <noreply@communitygardens.com>',
        to: email,
        subject: '🌱 Verify Your Email - Community Gardens',
        text: `
Hello ${userName},

Welcome to Community Gardens! Please verify your email address to complete your registration.

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't create an account, please ignore this email.

Best regards,
Community Gardens Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .code { background: #10b981; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌱 Welcome to Community Gardens!</h1>
      <p>Verify your email to get started</p>
    </div>
    <div class="content">
      <h2>Hello ${userName},</h2>
      <p>Thank you for joining our community! Please verify your email address to complete your registration and start discovering amazing community gardens.</p>
      
      <div class="code">${code}</div>
      
      <p><strong>Important:</strong></p>
      <ul>
        <li>This code will expire in <strong>10 minutes</strong></li>
        <li>Enter this code on the verification page</li>
        <li>Keep this code secure and don't share it</li>
      </ul>
      
      <p>If you didn't create an account, please ignore this email.</p>
      
      <div class="footer">
        <p>Best regards,<br>The Community Gardens Team</p>
        <p>🌱 Growing communities, one garden at a time</p>
      </div>
    </div>
  </div>
</body>
</html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email verification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send 2FA code
  async send2FACode(email, code, userName = 'User') {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Community Gardens" <noreply@communitygardens.com>',
        to: email,
        subject: '🔐 Your 2FA Code - Community Gardens',
        text: `
Hello ${userName},

Your two-factor authentication code is: ${code}

This code will expire in 5 minutes.

If you didn't request this code, please secure your account immediately.

Best regards,
Community Gardens Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .code { background: #3b82f6; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 3px; }
    .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Two-Factor Authentication</h1>
      <p>Secure login verification</p>
    </div>
    <div class="content">
      <h2>Hello ${userName},</h2>
      <p>Someone is trying to log into your Community Gardens account. If this is you, please use the code below:</p>
      
      <div class="code">${code}</div>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong>
        <ul>
          <li>This code expires in <strong>5 minutes</strong></li>
          <li>Never share this code with anyone</li>
          <li>If you didn't request this, secure your account immediately</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Best regards,<br>The Community Gardens Security Team</p>
      </div>
    </div>
  </div>
</body>
</html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ 2FA code sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ 2FA email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email after successful verification
  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"Community Gardens" <noreply@communitygardens.com>',
        to: email,
        subject: '🎉 Welcome to Community Gardens!',
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .feature { margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Community Gardens!</h1>
      <p>Your account is now verified and ready to use</p>
    </div>
    <div class="content">
      <h2>Hello ${userName},</h2>
      <p>Congratulations! Your email has been verified and your account is now active. You're ready to start exploring and connecting with community gardens!</p>
      
      <div class="features">
        <h3>🌱 What you can do now:</h3>
        <div class="feature">🗺️ <strong>Discover Gardens:</strong> Find community gardens near you</div>
        <div class="feature">👥 <strong>Join Communities:</strong> Connect with local gardeners</div>
        <div class="feature">📅 <strong>Attend Events:</strong> Participate in garden activities</div>
        <div class="feature">🌿 <strong>Manage Plots:</strong> Request and manage garden plots</div>
      </div>
      
      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
          🚀 Go to Dashboard
        </a>
      </p>
      
      <p>Happy gardening!</p>
      
      <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px;">
        <p>The Community Gardens Team</p>
        <p>🌱 Growing communities, one garden at a time</p>
      </div>
    </div>
  </div>
</body>
</html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Welcome email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
