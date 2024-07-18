import express from 'express';
import { authenticate, authorizeAsAdmin } from '../middlewares/authMiddleware.js';
import { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById, getTotalProductByCategory} from '../controllers/categoryController.js';

const router = express.Router();
router.route('/total-products-by-category').get(authenticate, authorizeAsAdmin, getTotalProductByCategory);

router.route("/").post(authenticate, authorizeAsAdmin, createCategory)
router.route("/:categoryId").put(authenticate, authorizeAsAdmin, updateCategory).delete(authenticate, authorizeAsAdmin, deleteCategory)

router.route("/categories").get(getAllCategories)
router.route("/:id").get(getCategoryById)


export default router;

