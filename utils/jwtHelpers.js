import jwt from "jsonwebtoken"

const key = process.env.SECRET_KEY
export const generateToken = (user) => {
    return jwt.sign({email: user.email, id: user._id, role: user.role}, key, {
        expiresIn: "3d"
    })
}

export const verifyToken = (token) => {
    return jwt.verify(token, key)
}

export default {
    generateToken,
    verifyToken
}