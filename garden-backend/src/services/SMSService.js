const crypto = require('crypto');

class SMSService {
  constructor() {
    // In production, you would use services like:
    // - Twilio
    // - AWS SNS
    // - Vonage (Nexmo)
    // - MessageBird
    
    this.initializeService();
  }

  initializeService() {
    // For development, we'll simulate SMS sending
    if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_ACCOUNT_SID) {
      console.log('📱 Using development SMS service (logs only)');
      this.isProduction = false;
    } else {
      // Initialize Twilio or other SMS service
      this.isProduction = true;
      // const twilio = require('twilio');
      // this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  // Generate verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  // Format phone number
  formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing (assume US +1)
    if (cleaned.length === 10) {
      return '+1' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    }
    
    return phone; // Return as-is if already formatted or international
  }

  // Validate phone number
  isValidPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Send SMS verification code
  async sendVerificationCode(phone, code, userName = 'User') {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      if (!this.isValidPhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const message = `🌱 Community Gardens\n\nHi ${userName}! Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore.`;

      if (this.isProduction) {
        // Production SMS sending (Twilio example)
        /*
        const result = await this.client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedPhone
        });
        
        console.log('✅ SMS verification sent:', result.sid);
        return { success: true, messageId: result.sid };
        */
        
        // For now, simulate success
        console.log('✅ SMS would be sent to:', formattedPhone);
        return { success: true, messageId: 'prod-' + Date.now() };
      } else {
        // Development mode - log the SMS
        console.log('📱 SMS WOULD BE SENT:');
        console.log('To:', formattedPhone);
        console.log('Message:', message);
        console.log('Code:', code);
        
        return { success: true, messageId: 'dev-' + Date.now() };
      }
    } catch (error) {
      console.error('❌ SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send 2FA code via SMS
  async send2FACode(phone, code, userName = 'User') {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      if (!this.isValidPhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const message = `🔐 Community Gardens Security\n\nYour 2FA code: ${code}\n\nExpires in 5 minutes.\n\nIf you didn't request this, secure your account immediately.`;

      if (this.isProduction) {
        // Production SMS sending
        console.log('✅ 2FA SMS would be sent to:', formattedPhone);
        return { success: true, messageId: 'prod-2fa-' + Date.now() };
      } else {
        // Development mode
        console.log('📱 2FA SMS WOULD BE SENT:');
        console.log('To:', formattedPhone);
        console.log('Message:', message);
        console.log('Code:', code);
        
        return { success: true, messageId: 'dev-2fa-' + Date.now() };
      }
    } catch (error) {
      console.error('❌ 2FA SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome SMS after successful verification
  async sendWelcomeSMS(phone, userName) {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      if (!this.isValidPhoneNumber(formattedPhone)) {
        throw new Error('Invalid phone number format');
      }

      const message = `🎉 Welcome to Community Gardens, ${userName}!\n\nYour account is verified and ready. Start exploring gardens near you!\n\n🌱 Happy gardening!`;

      if (this.isProduction) {
        // Production SMS sending
        console.log('✅ Welcome SMS would be sent to:', formattedPhone);
        return { success: true, messageId: 'prod-welcome-' + Date.now() };
      } else {
        // Development mode
        console.log('📱 WELCOME SMS WOULD BE SENT:');
        console.log('To:', formattedPhone);
        console.log('Message:', message);
        
        return { success: true, messageId: 'dev-welcome-' + Date.now() };
      }
    } catch (error) {
      console.error('❌ Welcome SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SMSService();
