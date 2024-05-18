import { Schema, Types, model } from "mongoose";

const subjectSchema = Schema({
    name: String,
    logo: {
        filename: String,
        url: String
    },
    chapters: [{type: Types.ObjectId, ref: "Chapter"}],
})

export default model("Subject", subjectSchema)