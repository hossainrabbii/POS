import { Router } from "express";

import authMiddleware from "../../middlewares/authMiddleware.js";

import { getAllUsersController } from "./user.controller.js";

const router = Router();

// ======================================================
// AUTHENTICATION
// ======================================================

router.use(authMiddleware);

// ======================================================
// GET ALL USERS
// ======================================================

router.get("/", getAllUsersController);

export default router;