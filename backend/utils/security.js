const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Security headers
exports.setSecurityHeaders = helmet();

// Rate limiting
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many attempts from this IP, please try again later'
});

// Data sanitization
exports.sanitizeData = [
  mongoSanitize(),
  xss()
];