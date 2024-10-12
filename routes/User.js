import { Router } from "express";
import catchAsync from "../utils/catchAsync.js";
import user from "../controller/User.js";
import { isUserAuthorized, isUserAuthenticated, isClassValid, isUserUpdateValid } from "../middleware/Auth.js";

const router = Router();

router
    .route("/")
    .get(isUserAuthenticated, isUserAuthorized, catchAsync(user.get))
    .delete(isUserAuthenticated, isUserAuthorized, catchAsync(user.remove))
    .patch(isUserAuthenticated, isUserAuthorized, isUserUpdateValid, isClassValid, catchAsync(user.update))
    
router
    .route("/history")
    .post(isUserAuthenticated, isUserAuthorized, catchAsync(user.addHistory))

export default router