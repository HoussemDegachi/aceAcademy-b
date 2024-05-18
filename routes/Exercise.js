import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";

const router = Router()

router
    .route("/:id/report")
    .post(catchAsync((req, res) => {}))

export default router