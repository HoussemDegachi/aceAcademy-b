import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import chapter from "../controller/Chapter.js"
import { isUserAuthenticated } from "../middleware/Auth.js";

const router = Router()

router
    .route("/:id")
    .get(isUserAuthenticated, catchAsync(chapter.get))

router
    .route("/:id/exercise")
    .get(isUserAuthenticated, catchAsync(chapter.getRandomExercise))

export default router