
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User Registration
 *     description: Registers a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Bad request
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Unauthorized
 */
router.post('/signup', authController.signup);
router.post('/resendVerificationCode', authController.login);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/verify', authController.verifyEmail);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/me',authenticateToken,authController.getme);
router.put('/update',authenticateToken,authController.updateMe);





module.exports = router;
