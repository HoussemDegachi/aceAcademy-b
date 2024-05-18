import User from "../models/User.js"
import ExpressError from "../utils/ExpressError.js"
import { generateToken } from "../utils/jwtHelpers.js"

export const signup = async (req, res) => {
    const {email, password, userName, classId} = req.body

    // create new account
    const user = new User({email, password, userName, class: classId})
    await user.save()
    const token = generateToken(user)

    res.status(201).json({
        message: "Successfully created new account",
        token
    })
}

export const login = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findAndValidate(email, password)
    if (!user) {
        throw new ExpressError("Incorrect email or password", 403)
    }
    // sign jwt
    const token = generateToken(user)

    res.status(200).json({
        message: "Loged in successfully",
        token
    })
}

export default {
    signup, login
}