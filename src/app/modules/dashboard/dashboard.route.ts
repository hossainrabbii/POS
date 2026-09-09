import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import { getDashboardOverviewController } from "./dashboard.controller.js";

const router = Router();

// ======================================================
// ALL PRODUCT ROUTES REQUIRE VALID ACCESS TOKEN
// ======================================================

router.use(authMiddleware);

// ======================================================
// GET DASHBOARD OVERVIEW
// ======================================================

router.get("/overview", getDashboardOverviewController);

export default router;
