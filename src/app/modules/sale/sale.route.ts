import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import {
  createSaleController,
  addSalePaymentController,
  getAllSalesController,
  getSaleByIdController,
  getSalesStatisticsController,
} from "./sale.controller.js";

const router = Router();

// ======================================================
// ALL PRODUCT ROUTES REQUIRE VALID ACCESS TOKEN
// ======================================================

router.use(authMiddleware);
// ======================================================
// CREATE SALE
// ======================================================

router.post("/", createSaleController);

// ======================================================
// RECEIVE DUE PAYMENT
// ======================================================

router.post("/:saleId/payment", addSalePaymentController);

// ======================================================
// GET ALL SALES
// ======================================================

router.get("/", getAllSalesController);

// ======================================================
// GET SALES STATISTICS
// ======================================================

router.get("/statistics", getSalesStatisticsController);

// ======================================================
// GET SINGLE SALE
// ======================================================

router.get("/:saleId", getSaleByIdController);

export default router;
