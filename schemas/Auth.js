import Joi from "joi"

export const user = Joi.object({
    userName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    classId: Joi.string().required()
}).required()

user.validate()

export default {
    user
}