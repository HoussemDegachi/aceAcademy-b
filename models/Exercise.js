import { Schema, Types, model } from "mongoose";

const exerciseSchema = Schema({
    image: {
        filename: String,
        url: String
    },
    reports: {
        type: Number,
        default: 0
    },
    reportedBy: [
        {type: Types.ObjectId, ref: "User"}
    ],
    xpCount: {
        type: Number,
        min: 0
    },
    chapter: {type: Types.ObjectId, ref: "Chapter"}
})

export default model("Exercise", exerciseSchema)