import { Schema, model } from "mongoose"

const classSchema = new Schema({
    name: String,
    orientation: String,
    grade: Number,
    state: {
        type: String,
        enum: ["Primary", "Middle", "Secondary"]
    },
    subjects: [{type: Schema.Types.ObjectId, ref: "Subject"}]
})

export default model("Class", classSchema)