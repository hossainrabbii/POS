import type { Response } from "express";

import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";

import {
  addSalePaymentValidation,
  createSaleValidation,
  getAllSalesValidation,
  getSalesStatisticsValidation,
} from "./sale.validation.js";

import {
  addSalePayment,
  createSale,
  getAllSales,
  getSaleById,
  getSalesStatistics,
} from "./sale.service.js";

// ======================================================
// CREATE SALE
// ======================================================

export const createSaleController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Validate request body
  // --------------------------------------------------

  const data = createSaleValidation.parse(req.body);

  // --------------------------------------------------
  // Create sale
  // --------------------------------------------------

  const result = await createSale(data, req.userId);

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(201).json({
    success: true,
    message: "Sale created successfully",
    data: result,
  });
};

// ======================================================
// GET ALL SALES
// ======================================================

export const getAllSalesController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Validate query parameters
  // --------------------------------------------------

  const query = getAllSalesValidation.parse(req.query);

  // --------------------------------------------------
  // Get sales
  // --------------------------------------------------

  const result = await getAllSales(
    query.page,
    query.limit,
    query.search,
    query.paymentStatus,
    query.soldBy,
    query.from,
    query.to,
  );

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Sales fetched successfully",
    data: result,
  });
};
// ======================================================
// GET SALES STATISTICS
// ======================================================

export const getSalesStatisticsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Validate query parameters
  // --------------------------------------------------

  const query = getSalesStatisticsValidation.parse(req.query);

  // --------------------------------------------------
  // Get statistics
  // --------------------------------------------------

  const result = await getSalesStatistics(
    query.period,
    query.year,
    query.from,
    query.to,
  );

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Sales statistics fetched successfully",
    data: result,
  });
};
// ======================================================
// GET SINGLE SALE
// ======================================================

export const getSaleByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Sale ID
  // --------------------------------------------------

  const saleId = Array.isArray(req.params.saleId)
    ? req.params.saleId[0]
    : req.params.saleId;

  if (!saleId) {
    return res.status(400).json({
      success: false,
      message: "Sale ID is required",
    });
  }

  // --------------------------------------------------
  // Get sale
  // --------------------------------------------------

  const result = await getSaleById(saleId);

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Sale fetched successfully",
    data: result,
  });
};

// ======================================================
// ADD SALE PAYMENT
// ======================================================

export const addSalePaymentController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // --------------------------------------------------
  // Sale ID
  // --------------------------------------------------

  const saleId = Array.isArray(req.params.saleId)
    ? req.params.saleId[0]
    : req.params.saleId;

  if (!saleId) {
    return res.status(400).json({
      success: false,
      message: "Sale ID is required",
    });
  }

  // --------------------------------------------------
  // Validate body
  // --------------------------------------------------

  const data = addSalePaymentValidation.parse(req.body);

  // --------------------------------------------------
  // Add payment
  // --------------------------------------------------

  const result = await addSalePayment(saleId, data, req.userId);

  // --------------------------------------------------
  // Response
  // --------------------------------------------------

  return res.status(200).json({
    success: true,
    message: "Payment received successfully",
    data: result,
  });
};
