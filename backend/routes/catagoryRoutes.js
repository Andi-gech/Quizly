const express = require('express');
const router = express.Router();
const catagoryController = require('../controllers/catagoryController');
const authenticateToken = require('../middleware/authMiddleware');



/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API to manage categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category with a title, description, and FontAwesome icon name.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the category
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 description: The description of the category
 *                 example: "All things related to tech."
 *               FontAwesomeIconName:
 *                 type: string
 *                 description: The FontAwesome icon name for the category
 *                 example: "fa-laptop"
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request, missing or invalid data
 *       401:
 *         description: Unauthorized, token required
 */
router.post('/', authenticateToken, catagoryController.createCatagory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Fetches all the categories available in the system.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */
router.get('/', catagoryController.getAllCatagories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Fetches a single category by its unique ID.
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the category to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get('/:id', catagoryController.getCatagoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     description: Updates an existing category's information by its ID.
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the category to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the category
 *                 example: "Technology"
 *               description:
 *                 type: string
 *                 description: The description of the category
 *                 example: "Updated description."
 *               FontAwesomeIconName:
 *                 type: string
 *                 description: The FontAwesome icon name for the category
 *                 example: "fa-cogs"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Bad request, invalid data
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized, token required
 */
router.put('/:id', authenticateToken, catagoryController.updateCatagory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     description: Deletes a category from the system by its ID.
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the category to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized, token required
 */
router.delete('/:id', authenticateToken, catagoryController.deleteCatagory);

module.exports = router;