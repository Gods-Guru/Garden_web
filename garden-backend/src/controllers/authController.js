const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const { AppError } = require('../middleware/errorHandler');
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const role = req.body.role || 'user';
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return next(new AppError('User already exists', 400, 'USER_EXISTS'));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return next(new AppError('Invalid email', 400, 'INVALID_EMAIL'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new AppError('Invalid password', 400, 'INVALID_PASSWORD'));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};