import type {
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middlewares/authMiddleware.js";

import {
  getDashboardOverviewValidation,
} from "./dashboard.validation.js";

import {
  getDashboardOverview,
} from "./dashboard.service.js";


// ======================================================
// GET DASHBOARD OVERVIEW
// ======================================================

export const getDashboardOverviewController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {

    // --------------------------------------------------
    // Authentication
    // --------------------------------------------------

    if (
      !req.userId
    ) {

      return res.status(401).json({

        success:
          false,

        message:
          "Unauthorized",

      });
    }


    // --------------------------------------------------
    // Validate query parameters
    // --------------------------------------------------

    const query =
      getDashboardOverviewValidation.parse(
        req.query
      );


    // --------------------------------------------------
    // Get dashboard overview
    // --------------------------------------------------

    const result =
      await getDashboardOverview(

        query.period,

        query.year,

        query.from,

        query.to

      );


    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({

      success:
        true,

      message:
        "Dashboard overview fetched successfully",

      data:
        result,

    });
  };