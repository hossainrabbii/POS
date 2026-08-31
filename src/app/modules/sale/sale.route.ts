import {
  Router,
} from "express";

import authMiddleware
  from "../../middlewares/authMiddleware.js";

import {
  createSaleController,
  addSalePaymentController,
  getAllSalesController,
  getSaleByIdController,
  getSalesStatisticsController,
} from "./sale.controller.js";


const router =
  Router();


// ======================================================
// CREATE SALE
// ======================================================

router.post("/",authMiddleware,createSaleController);


// ======================================================
// RECEIVE DUE PAYMENT
// ======================================================

router.post(
  "/:saleId/payment",

  authMiddleware,
  addSalePaymentController
);

// ======================================================
// GET ALL SALES
// ======================================================

router.get(
  "/",
  authMiddleware,
  getAllSalesController
);

// ======================================================
// GET SALES STATISTICS
// ======================================================

router.get(
  "/statistics",
  authMiddleware,
  getSalesStatisticsController
);

// ======================================================
// GET SINGLE SALE
// ======================================================

router.get(
  "/:saleId",
  authMiddleware,
  getSaleByIdController
);
export default router;