import Chapter from "../models/Chapter.js"
import Exercise from "../models/Exercise.js"
import User from "../models/User.js"
import ExpressError from "../utils/ExpressError.js"
import { Types } from "mongoose"

export const get = async (req, res) => {
    const { id } = req.params

    // get chapter and validate eistence
    const chapter = await Chapter.findById(id)
    if (!chapter) throw new ExpressError("Chapter doesn't exist", 404)

    // send chapter
    res.status(500).json({
        message: "Chapter was found successfully",
        data: chapter
    })
}

export const getRandomExercise = async (req, res) => {
    // verify that Chapter id exists
    const { id } = req.params
    const formattedId = Types.ObjectId.createFromHexString(id)
    const { currentUser } = req.body

    if (!(await Chapter.exists({ _id: id }))) throw new ExpressError("Chapter doesn't exist", 404)

    // get user
    const user = await User.findById(currentUser.id)

    // get random exercise where chapterId = chapterId and nin exercise history
    const exercise = await Exercise.aggregate([
        { $match: { chapter: formattedId, _id: { $nin: user.history.exercises } } }, { $sample: { size: 1 } }
    ])

    // if null get random exercise
    if (!exercise.length) {
        const newExercise = await Exercise.aggregate([{$match: {chapter: formattedId}}, { $sample: { size: 1 } }])
        exercise.push(newExercise[0])
    }

    // return data
    res.status(200).json({
        message: "An exercise was found successfully",
        data: exercise[0]
    })
}

export default {
    get,
    getRandomExercise
}