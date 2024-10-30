import jwt from "jsonwebtoken"

export const key = process.env.SECRET_KEY

export const generateResetCode = (email) => {
    return jwt.sign({email, isReset: true}, key, {
        expiresIn: 15 * 60
    })
}

export default {
    generateResetCode
}