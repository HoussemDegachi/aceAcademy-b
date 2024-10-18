import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
        required: true
    }
})

otpSchema.pre("save", async function (next) {
    if (!this.isModified("code")) return next()
    this.generatedAt = Date.now()
    this.code = await bcrypt.hash(this.code, 12)
    next()
})

export default model("Otp", otpSchema)