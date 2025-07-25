const crypto = require('crypto');
const EmailService = require('./EmailService');
const SMSService = require('./SMSService');

class VerificationService {
  constructor() {
    // In-memory storage for development (use Redis in production)
    this.verificationCodes = new Map();
    this.twoFactorCodes = new Map();
    
    // Cleanup expired codes every 5 minutes
    setInterval(() => {
      this.cleanupExpiredCodes();
    }, 5 * 60 * 1000);
  }

  // Generate verification code
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  // Generate secure token
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Store verification code
  storeVerificationCode(identifier, code, type = 'email', expiryMinutes = 10) {
    const key = `${type}:${identifier}`;
    const expiresAt = Date.now() + (expiryMinutes * 60 * 1000);
    
    this.verificationCodes.set(key, {
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      type,
      identifier,
      createdAt: Date.now()
    });

    console.log(`📝 Stored ${type} verification code for ${identifier}: ${code} (expires in ${expiryMinutes}min)`);
  }

  // Store 2FA code
  store2FACode(identifier, code, type = 'email', expiryMinutes = 5) {
    const key = `2fa:${type}:${identifier}`;
    const expiresAt = Date.now() + (expiryMinutes * 60 * 1000);
    
    this.twoFactorCodes.set(key, {
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      type,
      identifier,
      createdAt: Date.now()
    });

    console.log(`🔐 Stored 2FA code for ${identifier}: ${code} (expires in ${expiryMinutes}min)`);
  }

  // Verify code
  verifyCode(identifier, inputCode, type = 'email', is2FA = false) {
    const prefix = is2FA ? '2fa:' : '';
    const key = `${prefix}${type}:${identifier}`;
    const storage = is2FA ? this.twoFactorCodes : this.verificationCodes;
    const stored = storage.get(key);

    if (!stored) {
      return {
        success: false,
        error: 'No verification code found. Please request a new code.',
        code: 'CODE_NOT_FOUND'
      };
    }

    // Check if expired
    if (Date.now() > stored.expiresAt) {
      storage.delete(key);
      return {
        success: false,
        error: 'Verification code has expired. Please request a new code.',
        code: 'CODE_EXPIRED'
      };
    }

    // Check attempts
    if (stored.attempts >= stored.maxAttempts) {
      storage.delete(key);
      return {
        success: false,
        error: 'Too many failed attempts. Please request a new code.',
        code: 'TOO_MANY_ATTEMPTS'
      };
    }

    // Increment attempts
    stored.attempts++;

    // Check code
    if (stored.code !== inputCode) {
      return {
        success: false,
        error: `Invalid code. ${stored.maxAttempts - stored.attempts} attempts remaining.`,
        code: 'INVALID_CODE',
        attemptsRemaining: stored.maxAttempts - stored.attempts
      };
    }

    // Success - remove code
    storage.delete(key);
    return {
      success: true,
      message: 'Code verified successfully'
    };
  }

  // Send email verification
  async sendEmailVerification(email, userName = 'User') {
    try {
      console.log(`🔐 Generating verification code for: ${email}`);
      const code = this.generateCode();

      // Store the code
      this.storeVerificationCode(email, code, 'email', 10);
      console.log(`💾 Verification code stored for: ${email}`);

      // Send email
      console.log(`📧 Sending verification email to: ${email}`);
      const result = await EmailService.sendEmailVerification(email, code, userName);

      if (result.success) {
        console.log(`✅ Verification email sent successfully to: ${email}`);
        return {
          success: true,
          message: 'Verification code sent to your email',
          expiresIn: 10 * 60 * 1000 // 10 minutes in milliseconds
        };
      } else {
        console.error(`❌ Failed to send verification email to ${email}:`, result.error);
        return {
          success: false,
          error: 'Failed to send verification email: ' + result.error
        };
      }
    } catch (error) {
      console.error('❌ Email verification service error:', error);
      return {
        success: false,
        error: 'Failed to send verification email: ' + error.message
      };
    }
  }

  // Send SMS verification
  async sendSMSVerification(phone, userName = 'User') {
    try {
      const code = this.generateCode();
      
      // Store the code
      this.storeVerificationCode(phone, code, 'sms', 10);
      
      // Send SMS
      const result = await SMSService.sendVerificationCode(phone, code, userName);
      
      if (result.success) {
        return {
          success: true,
          message: 'Verification code sent to your phone',
          expiresIn: 10 * 60 * 1000 // 10 minutes in milliseconds
        };
      } else {
        return {
          success: false,
          error: 'Failed to send verification SMS: ' + result.error
        };
      }
    } catch (error) {
      console.error('❌ SMS verification error:', error);
      return {
        success: false,
        error: 'Failed to send verification SMS'
      };
    }
  }

  // Send 2FA code
  async send2FACode(identifier, type = 'email', userName = 'User') {
    try {
      const code = this.generateCode();
      
      // Store the 2FA code
      this.store2FACode(identifier, code, type, 5);
      
      let result;
      if (type === 'email') {
        result = await EmailService.send2FACode(identifier, code, userName);
      } else if (type === 'sms') {
        result = await SMSService.send2FACode(identifier, code, userName);
      } else {
        throw new Error('Invalid 2FA type');
      }
      
      if (result.success) {
        return {
          success: true,
          message: `2FA code sent to your ${type}`,
          expiresIn: 5 * 60 * 1000 // 5 minutes in milliseconds
        };
      } else {
        return {
          success: false,
          error: `Failed to send 2FA code: ${result.error}`
        };
      }
    } catch (error) {
      console.error('❌ 2FA sending error:', error);
      return {
        success: false,
        error: 'Failed to send 2FA code'
      };
    }
  }

  // Verify email code
  verifyEmailCode(email, code) {
    return this.verifyCode(email, code, 'email', false);
  }

  // Verify SMS code
  verifySMSCode(phone, code) {
    return this.verifyCode(phone, code, 'sms', false);
  }

  // Verify 2FA code
  verify2FACode(identifier, code, type = 'email') {
    return this.verifyCode(identifier, code, type, true);
  }

  // Cleanup expired codes
  cleanupExpiredCodes() {
    const now = Date.now();
    let cleaned = 0;

    // Clean verification codes
    for (const [key, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(key);
        cleaned++;
      }
    }

    // Clean 2FA codes
    for (const [key, data] of this.twoFactorCodes.entries()) {
      if (now > data.expiresAt) {
        this.twoFactorCodes.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired verification codes`);
    }
  }

  // Get verification status
  getVerificationStatus(identifier, type = 'email', is2FA = false) {
    const prefix = is2FA ? '2fa:' : '';
    const key = `${prefix}${type}:${identifier}`;
    const storage = is2FA ? this.twoFactorCodes : this.verificationCodes;
    const stored = storage.get(key);

    if (!stored) {
      return { exists: false };
    }

    const now = Date.now();
    const timeRemaining = stored.expiresAt - now;
    const isExpired = timeRemaining <= 0;

    return {
      exists: true,
      isExpired,
      timeRemaining: Math.max(0, timeRemaining),
      attempts: stored.attempts,
      maxAttempts: stored.maxAttempts,
      attemptsRemaining: stored.maxAttempts - stored.attempts
    };
  }
}

module.exports = new VerificationService();
