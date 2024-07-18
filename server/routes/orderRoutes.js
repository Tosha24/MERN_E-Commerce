import express from "express";
import {
  authenticate,
  authorizeAsAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getTotalOrdersCount,
  getTotalSalesAmount,
  calcualteTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered
} from "../controllers/orderController.js";
const router = express.Router();

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAsAdmin, getAllOrders);

router.route("/myorders").get(authenticate, getUserOrders);
router
  .route("/total-orders")
  .get(authenticate, authorizeAsAdmin, getTotalOrdersCount);
router
  .route("/totalsalesamount")
  .get(authenticate, authorizeAsAdmin, getTotalSalesAmount);

router.route("/totalsalesbydate").get(authenticate, authorizeAsAdmin, calcualteTotalSalesByDate)

router.route("/:id").get(authenticate, getOrderById)
router.route("/:id/pay").put(authenticate, markOrderAsPaid)
router.route("/:id/deliver").put(authenticate, authorizeAsAdmin, markOrderAsDelivered)
export default router;
