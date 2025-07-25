const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Recursive object sanitization
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? xss(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip sensitive fields that shouldn't be sanitized
    if (['password', 'token', 'secret'].includes(key.toLowerCase())) {
      sanitized[key] = value;
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }
  
  return sanitized;
};

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length'));
  const maxSize = 10 * 1024 * 1024; // 10MB limit
  
  if (contentLength && contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Request entity too large',
      code: 'REQUEST_TOO_LARGE'
    });
  }
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// API versioning middleware
const apiVersioning = (req, res, next) => {
  // Default to v1 if no version specified
  if (!req.headers['api-version']) {
    req.apiVersion = 'v1';
  } else {
    req.apiVersion = req.headers['api-version'];
  }
  
  // Validate API version
  const supportedVersions = ['v1'];
  if (!supportedVersions.includes(req.apiVersion)) {
    return res.status(400).json({
      success: false,
      error: `Unsupported API version: ${req.apiVersion}`,
      code: 'UNSUPPORTED_API_VERSION',
      supportedVersions
    });
  }
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Health check endpoint
const healthCheck = (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthData);
};

// Error response formatter
const formatErrorResponse = (error, req) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    success: false,
    error: isDevelopment ? error.message : 'An error occurred',
    code: error.code || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };
};

module.exports = {
  sanitizeInput,
  requestSizeLimit,
  securityHeaders,
  apiVersioning,
  requestLogger,
  healthCheck,
  formatErrorResponse,
  mongoSanitize: mongoSanitize({
    replaceWith: '_'
  })
};
