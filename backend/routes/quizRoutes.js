// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     description: Creates a new quiz with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the quiz.
 *               description:
 *                 type: string
 *                 description: A brief description of the quiz.
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The question text.
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of possible answers.
 *                     correctAnswer:
 *                       type: string
 *                       description: The correct answer from the options.
 *     responses:
 *       201:
 *         description: Quiz successfully created
 *       400:
 *         description: Bad request
 */
router.post('/', quizController.createQuiz);

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Retrieve all quizzes
 *     description: Fetches a list of all available quizzes.
 *     responses:
 *       200:
 *         description: A list of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the quiz.
 *                   title:
 *                     type: string
 *                     description: The title of the quiz.
 *                   description:
 *                     type: string
 *                     description: A brief description of the quiz.
 *       500:
 *         description: Internal server error
 */
router.get('/', quizController.getAllQuizzes);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Retrieve a specific quiz by ID
 *     description: Fetches the details of a quiz using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the quiz.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the specified quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the quiz.
 *                 title:
 *                   type: string
 *                   description: The title of the quiz.
 *                 description:
 *                   type: string
 *                   description: A brief description of the quiz.
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', quizController.getQuizById);

module.exports = router;
