import bcrypt from "bcrypt"
import Mail from "../mailerSystem/mail.js"
import Otp from "../models/Otp.js"
import { randint } from "./funcs.js"


const generateOtp = async (email) => {
    const otpCode = randint(100000, 999999)
    const targetOtp = await Otp.findOne({ email })

    if (targetOtp) {
        targetOtp.code = otpCode
        targetOtp.expiresAt = Date.now() + 2 * 3600000
        await targetOtp.save()
    } else {
        const newOtp = new Otp({ email, code: otpCode, expiresAt: Date.now() + 2 * 3600000 })
        await newOtp.save()
    }

    return otpCode
}

export const generateAndSendOtp = async (email) => {
    const otpCode = await generateOtp(email)

    await new Mail()
        .to(email)
        .subject("Here is your otp")
        .text(`${otpCode}`)
        .send()
}

export const verifyOtp = async (email, otp) => {
    const originalOtp = await Otp.findOne({ email })

    if (!originalOtp || originalOtp.expiresAt < Date.now()) return false

    console.log(otp)
    console.log(originalOtp)

    return await bcrypt.compare(otp, originalOtp.code)
}