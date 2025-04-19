
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const quizController = require('../controllers/quizController');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/', authenticateToken,quizController.createQuiz);


router.get('/', quizController.getAllQuizzes);
router.get('/catagory/:catagoryId', quizController.getQuizzesByCatagory);


router.get('/:id', quizController.getQuizById);

router.post('/:quizId/score', authenticateToken, quizController.scoreQuiz);

router.post('/GenerateQuiz',authenticateToken,upload.single("file"),quizController.generateQuiz);

router.get('/leaderboard/calculatescore', quizController.LeaderBoard);
router.get('/quiz/mine', authenticateToken,quizController.getmyQuizzes);
router.get('/profile/stats', authenticateToken,quizController.getprofilestats);

module.exports = router;
