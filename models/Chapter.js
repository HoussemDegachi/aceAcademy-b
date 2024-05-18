import { Schema, Types, model } from "mongoose";

const chapterSchema = Schema({
    name: String,
    trimester: {
        type: Number,
        enum: [1, 2, 3]
    },
    order: Number,
    course: {
        video: {
            yId: String,
            link: String,
            duration: Number
        }
    },
    subject: {type: Types.ObjectId, ref: "Subject"},
    exercises: [{type: Types.ObjectId, ref: "Exercise"}]
})

export default model("Chapter", chapterSchema)