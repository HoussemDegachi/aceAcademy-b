import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import subject from "../controller/Subject.js"
import { isUserAuthenticated } from "../middleware/Auth.js";

const router = Router()

router
    .route("/:id")
    .get(isUserAuthenticated, catchAsync(subject.get))

export default router
