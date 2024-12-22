
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
 *                     questionText:
 *                       type: string
 *                       description: The question text.
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             description: The answer text.
 *                           isCorrect:
 *                             type: boolean
 *                             description: Indicates whether the answer is correct.
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       500:
 *         description: Internal server error
 */

router.post('/', authenticateToken,quizController.createQuiz);

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
/**
 * @swagger
 * /api/quizzes/{quizId}/score:
 *   post:
 *     summary: Submit quiz answers and calculate the user's score
 *     description: This endpoint allows users to submit their answers for a specific quiz. It calculates the score based on correct answers and updates the quiz history with the user's score.
 *     tags:
 *       - Quizzes
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz to score
 *         schema:
 *           type: string
 *           example: "64fa8bfda2b3dce2c5d5b619"
 *     requestBody:
 *       description: User's selected answers for the quiz questions
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 description: Array of objects, each containing a questionId and the selected answerId.
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: The ID of the question being answered
 *                       example: "6767e606d0469e9095702c47"
 *                     answerId:
 *                       type: string
 *                       description: The ID of the selected answer for the question
 *                       example: "6767e606d0469e9095702c48"
 *     responses:
 *       200:
 *         description: Successfully calculated the user's score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   description: The user's score for the quiz
 *                   example: 5
 *       401:
 *         description: Unauthorized - Token required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quiz not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error scoring quiz"
 *                 error:
 *                   type: string
 *                   example: "Error details here"
 */

router.post('/:quizId/score', authenticateToken, quizController.scoreQuiz);

/**
 * @swagger
 * /api/quizzes/generateQuiz:
 *   post:
 *     summary: Generate a quiz from a PDF file.
 *     description: Upload a PDF file and use Google Generative AI to create a multiple-choice quiz based on its content.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to generate the quiz from.
 *     responses:
 *       200:
 *         description: A quiz object containing questions, possible answers, and the correct answers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                         description: The question text.
 *                       answers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             answer:
 *                               type: string
 *                               description: The answer text.
 *                             isCorrect:
 *                               type: boolean
 *                               description: Indicates if the answer is correct.
 *       400:
 *         description: Bad request. Missing or incorrect parameters.
 *       500:
 *         description: Internal server error. Quiz generation failed.
 */

router.post('/GenerateQuiz',authenticateToken,upload.single("file"),quizController.generateQuiz);


module.exports = router;
