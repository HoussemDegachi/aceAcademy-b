import BaseJoi from "joi"
import sanitizeHtml from "sanitize-html"

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} contains malicious characters!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
  });

const Joi = BaseJoi.extend(extension)

export const user = Joi.object({
    userName: Joi.string().escapeHTML().min(2).required(),
    email: Joi.string().escapeHTML().email().required(),
    password: Joi.string().escapeHTML().min(8).required(),
    classId: Joi.string().escapeHTML().required()
}).required()

export default {
    user
}