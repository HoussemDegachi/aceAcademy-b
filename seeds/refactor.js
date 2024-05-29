import mongoose from "mongoose"
import Chapter from "../models/Chapter.js"
import Subject from "../models/Subject.js"
import Exercise from "../models/Exercise.js"


mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to DB")
})


const refactor = async () => {
    const subject = await Subject.findById("66538ca2e28809b0a42ca16f")
    for (let chapterId of subject.chapters) {
        const chapter = await Chapter.findById(chapterId)
        for (let exerciseId of chapter.exercises) {
            await Exercise.findByIdAndDelete(exerciseId)
        }
        await chapter.deleteOne()
    }
    await subject.deleteOne()
}

refactor().then(() => {
    console.log("Success")
    mongoose.connection.close()
})