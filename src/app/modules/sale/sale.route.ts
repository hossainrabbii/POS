import {
  Router,
} from "express";

import authMiddleware
  from "../../middlewares/authMiddleware.js";

import {
  createSaleController,
  addSalePaymentController,
} from "./sale.controller.js";


const router =
  Router();


// ======================================================
// CREATE SALE
// ======================================================

router.post(
  "/",

  authMiddleware,

  createSaleController
);


// ======================================================
// RECEIVE DUE PAYMENT
// ======================================================

router.post(
  "/:saleId/payment",

  authMiddleware,

  addSalePaymentController
);


export default router;