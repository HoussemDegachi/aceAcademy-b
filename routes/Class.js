import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import Class from "../controller/Class.js"
import { isUserAuthenticated } from "../middleware/Auth.js";

const router = Router()

router
    .route("/:id")
    .get(isUserAuthenticated, catchAsync(Class.get))

router
    .route("/")
    .get(catchAsync(Class.getAll))

export default router