import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import auth from "../controller/Auth.js"
import { isUserValid, isClassValid, isUserAuthenticated, isUserNotVerified, isResetCodeValid, isEmailExist, isPasswordValid } from "../middleware/Auth.js";

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

router
    .route("/otp")
    .post(isUserAuthenticated, isUserNotVerified, catchAsync(auth.sendOtp))
    .get(isUserAuthenticated, isUserNotVerified, catchAsync(auth.getOtp))

router
    .route("/reset-password")
    .get(isEmailExist, catchAsync(auth.sendResetCode))
    .post(isResetCodeValid, isPasswordValid, catchAsync(auth.resetPassword))

export default router;