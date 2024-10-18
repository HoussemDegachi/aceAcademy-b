import Class from "../models/Class.js"
import User from "../models/User.js"
import authSchemas from "../schemas/Auth.js"
import ExpressError from "../utils/ExpressError.js"
import { verifyToken } from "../utils/jwtHelpers.js"

export const isUserValid = (req, res, next) => {
    const {error} = authSchemas.user.validate(req.body)
    if (error) {
        const msg = error.message
        return next(new ExpressError(msg, 400))
    }
    return next()
}

export const isUserUpdateValid = (req, res, next) => {
    const {currentUser, id, ...userData} = req.body
    const {error} = authSchemas.userUpdate.validate(userData)
    if (error) {
        const msg = error.message
        return next(new ExpressError(msg, 400))
    }
    return next()
}

export const isClassValid = async (req, res, next) => {
    // verify that class exists
    const {classId} = req.body
    try {
        const targetClass = await Class.exists({_id: classId})
        if (!targetClass) {
            throw "Class doesn't exist"
    }
    } catch (err) {
        return next(new ExpressError("Class doesn't exist", 400))
    }
    next()
}

export const isUserAuthorized = async (req, res, next) => {
    const { currentUser, id } = req.body

    if (!id) {
        req.body.id = currentUser.id
        return next()
    }
    
    // get current User data
    if (currentUser.id !== id && !(currentUser.role == "Admin" || currentUser.role == "Manager")) return next(new ExpressError("You are not authorized", 403))

    next()
}

export const isUserAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers
    try {
        const token = authorization.split(" ")[1]
        const current = verifyToken(token)
        req.body.currentUser = current
    } catch (err) {
        return next(new ExpressError("You are not authenticated", 401))
    }
    next()
}

export const isUserNotVerified = async (req, res, next) => {
    const { currentUser } = req.body

    const userData = await User.findById(currentUser.id)

    if (userData.isVerified) {
        return next(new ExpressError("This email is already verified", 403))
    }

    next()
}

export default {isUserValid, isClassValid, isUserAuthorized, isUserAuthenticated}