import Otp from "../models/Otp.js"
import User from "../models/User.js"
import ExpressError from "../utils/ExpressError.js"
import { generateToken } from "../utils/jwtHelpers.js"
import { generateAndSendOtp, verifyOtp } from "../utils/otpHelpers.js"

export const signup = async (req, res) => {
    const {email, password, userName, classId} = req.body

    // create new account
    const user = new User({email, password, userName, class: classId})
    await user.save()
    const token = generateToken(user)
    await generateAndSendOtp(email)

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

export const sendOtp = async (req, res) => {
    const { currentUser, otp } = req.body

    if (await verifyOtp(currentUser.email, otp)) {

        const user = await User.findOneAndUpdate({ email: currentUser.email }, { isVerified: true }, {new: true})
        await Otp.deleteOne({ email: currentUser.email })

        res.status(200).json({
            message: "User have been verified successfully",
            data: user
        })
    } else {
        res.status(401).json({
            message: "Otp is incorrect"
        })
    }
}

export const getOtp = async (req, res) => {
    const { currentUser } = req.body

    await generateAndSendOtp(currentUser.email)
    res.status(201).json({
        message: "Otp have been sent successfully"
    })
}

export default {
    signup, login, getOtp, sendOtp
}