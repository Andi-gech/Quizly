const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');


router.post('/', authenticateToken,questionController.createQuestion);


router.get('/', authenticateToken,questionController.getAllQuestions);


router.get('/:id', authenticateToken,questionController.getQuestion);


router.put('/:id', authenticateToken,questionController.updateQuestion);

router.delete('/:id', authenticateToken,questionController.deleteQuestion);

module.exports = router;
