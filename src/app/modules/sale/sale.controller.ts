import type {
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middlewares/authMiddleware.js";

import {
  addSalePaymentValidation,
  createSaleValidation,
} from "./sale.validation.js";

import {
  addSalePayment,
  createSale,
} from "./sale.service.js";


// ======================================================
// CREATE SALE
// ======================================================

export const createSaleController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {

    if (!req.userId) {
      return res.status(401).json({
        success: false,

        message:
          "Unauthorized",
      });
    }


    const data =
      createSaleValidation.parse(
        req.body
      );


    const result =
      await createSale(
        data,
        req.userId
      );


    return res.status(201).json({
      success: true,

      message:
        "Sale created successfully",

      data: result,
    });
  };


// ======================================================
// ADD SALE PAYMENT
// ======================================================

export const addSalePaymentController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (!req.userId) {
      return res.status(401).json({
        success: false,

        message:
          "Unauthorized",
      });
    }


    // --------------------------------------------------
    // Sale ID
    // --------------------------------------------------

   const saleId =
  Array.isArray(req.params.saleId)
    ? req.params.saleId[0]
    : req.params.saleId;


    if (!saleId) {
      return res.status(400).json({
        success: false,

        message:
          "Sale ID is required",
      });
    }


    // --------------------------------------------------
    // Validate body
    // --------------------------------------------------

    const data =
      addSalePaymentValidation.parse(
        req.body
      );


    // --------------------------------------------------
    // Add payment
    // --------------------------------------------------

    const result =
      await addSalePayment(
        saleId,
        data,
        req.userId
      );


    return res.status(200).json({
      success: true,

      message:
        "Payment received successfully",

      data: result,
    });
  };