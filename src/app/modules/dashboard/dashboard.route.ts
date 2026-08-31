import {
  Router,
} from "express";

import authMiddleware
  from "../../middlewares/authMiddleware.js";

import {
  getDashboardOverviewController,
} from "./dashboard.controller.js";


const router =
  Router();


// ======================================================
// GET DASHBOARD OVERVIEW
// ======================================================

router.get(

  "/overview",

  authMiddleware,

  getDashboardOverviewController

);


export default router;