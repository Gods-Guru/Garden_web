const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const VerificationService = require('../services/VerificationService');
const EmailService = require('../services/EmailService');
const SMSService = require('../services/SMSService');

// VerificationService is already an instance
const verificationService = VerificationService;

// Register
const { AppError } = require('../middleware/errorHandler');
exports.register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const role = req.body.role || 'user';

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return next(new AppError('Name, email, and password are required', 400));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }

    // Validate password strength
    if (password.length < 6) {
      return next(new AppError('Password must be at least 6 characters long', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400, 'USER_EXISTS'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (not verified initially)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      role,
      emailVerified: true, // Skip email verification for now
      phoneVerified: false,
      twoFactorEnabled: false
    });

    await user.save();
    console.log(`✅ User created: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now sign in.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
    }

    // Skip email verification check for now
    // if (!user.emailVerified) {
    //   // Send new verification code
    //   const verificationResult = await VerificationService.sendEmailVerification(email, user.name);

    //   return res.status(403).json({
    //     success: false,
    //     message: 'Please verify your email before logging in. A new verification code has been sent.',
    //     code: 'EMAIL_NOT_VERIFIED',
    //     data: {
    //       requiresVerification: true,
    //       verificationSent: verificationResult.success,
    //       nextStep: 'email_verification'
    //     }
    //   });
    // }

    // Check if 2FA is enabled for this user
    if (user.twoFactorEnabled) {
      // Send 2FA code
      const twoFactorMethod = user.twoFactorMethod || 'email';
      const identifier = twoFactorMethod === 'email' ? user.email : user.phone;

      if (!identifier) {
        return next(new AppError('2FA method not properly configured', 500));
      }

      const twoFactorResult = await verificationService.send2FACode(identifier, twoFactorMethod, user.name);

      if (!twoFactorResult.success) {
        console.error('❌ Failed to send 2FA code:', twoFactorResult.error);
        return next(new AppError('Failed to send 2FA code', 500));
      }

      return res.json({
        success: true,
        message: `2FA code sent to your ${twoFactorMethod}`,
        data: {
          requires2FA: true,
          email: user.email,
          twoFactorMethod,
          nextStep: '2fa_verification',
          expiresIn: twoFactorResult.expiresIn
        }
      });
    }

    // Generate JWT token for successful login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log(`✅ User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          twoFactorEnabled: user.twoFactorEnabled
        },
        token,
        redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    next(error);
  }
};

// Verify email
exports.verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return next(new AppError('Email and verification code are required', 400));
    }

    // Verify the code
    const verificationResult = verificationService.verifyEmailCode(email, code);

    if (!verificationResult.success) {
      return next(new AppError(verificationResult.error, 400, verificationResult.code));
    }

    // Find and update user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailVerified) {
      return res.json({
        success: true,
        message: 'Email already verified',
        data: { alreadyVerified: true }
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    console.log(`✅ Email verified for user: ${user.email}`);

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, user.name);

    // Generate JWT token for verified user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Community Gardens!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        },
        token,
        redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      }
    });
  } catch (error) {
    console.error('❌ Email verification error:', error);
    next(error);
  }
};

// Resend verification code
exports.resendVerification = async (req, res, next) => {
  const { email, type = 'email' } = req.body;

  try {
    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.emailVerified && type === 'email') {
      return next(new AppError('Email is already verified', 400));
    }

    // Send verification code
    let result;
    if (type === 'email') {
      result = await verificationService.sendEmailVerification(email, user.name);
    } else if (type === 'sms' && user.phone) {
      result = await verificationService.sendSMSVerification(user.phone, user.name);
    } else {
      return next(new AppError('Invalid verification type or phone number not provided', 400));
    }

    if (!result.success) {
      return next(new AppError(`Failed to send verification: ${result.error}`, 500));
    }

    res.json({
      success: true,
      message: `Verification code sent to your ${type}`,
      data: {
        type,
        expiresIn: result.expiresIn
      }
    });
  } catch (error) {
    console.error('❌ Resend verification error:', error);
    next(error);
  }
};

// Verify 2FA code
exports.verify2FA = async (req, res, next) => {
  const { email, code, type = 'email' } = req.body;

  try {
    if (!email || !code) {
      return next(new AppError('Email and 2FA code are required', 400));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (!user.emailVerified) {
      return next(new AppError('Email must be verified before 2FA', 403));
    }

    if (!user.twoFactorEnabled) {
      return next(new AppError('2FA is not enabled for this account', 400));
    }

    // Verify 2FA code
    const identifier = type === 'email' ? user.email : user.phone;
    const verificationResult = verificationService.verify2FACode(identifier, code, type);

    if (!verificationResult.success) {
      return next(new AppError(verificationResult.error, 400, verificationResult.code));
    }

    // Generate JWT token for successful 2FA
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log(`✅ 2FA verified for user: ${user.email}`);

    res.json({
      success: true,
      message: '2FA verification successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          twoFactorEnabled: user.twoFactorEnabled
        },
        token,
        redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
      }
    });
  } catch (error) {
    console.error('❌ 2FA verification error:', error);
    next(error);
  }
};