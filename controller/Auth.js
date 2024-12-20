import Mail from "../mailerSystem/mail.js"
import Otp from "../models/Otp.js"
import User from "../models/User.js"
import ExpressError from "../utils/ExpressError.js"
import { generateToken } from "../utils/jwtHelpers.js"
import { generateAndSendOtp, verifyOtp } from "../utils/otpHelpers.js"
import { generateResetCode } from "../utils/passwordResetHelpers.js"

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

export const sendResetCode = async (req, res) => {
    const {email} = req.body
    const code = generateResetCode(email)
    const resetUrl = `${process.env.FRONTEND_BASE}/reset/${code}`
    
    await new Mail()
        .to(email)
        .subject("Here is your reset link")
        .text(resetUrl)
        .send()

    res.status(201).json({
        message: "Reset link have been sent successfully"
    })
}

export const resetPassword = async (req, res) => {
    const { password, currentUser: {email} } = req.body

    console.log(email)
    
    const targetUser = await User.findOne({email})
    targetUser.password = password
    await targetUser.save()

    res.status(200).json({
        message: "Password have been updated successfully",
        data: targetUser
    })
}

export const verifyResetCode = async (req, res) => {
    res.status(200).json({
	message: "This token is valid",
    })
}

export default {
    signup, login, getOtp, sendOtp, sendResetCode, resetPassword, verifyResetCode
}
