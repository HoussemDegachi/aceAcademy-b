import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import auth from "../controller/Auth.js"
import { isUserValid, isClassValid } from "../middleware/Auth.js";
const router = Router();

router
    .route("/login")
    .post(catchAsync(auth.login));

router
    .route("/signup")
    .post(isUserValid, isClassValid, catchAsync(auth.signup))

router
    .route("/signout")
    .post(catchAsync(auth.signout))

export default router;