import User from "../models/User.js"
import Exercise from "../models/Exercise.js"
import ExpressError from "../utils/ExpressError.js"

export const get = async (req, res) => {
    const { id } = req.body
    try {
        const user = await User.findById(id)
        if (!user) throw "User was't found"
        res.status(200).json({
            message: "User was found",
            data: user
        })
    } catch (err) {
        throw new ExpressError("User wasn't found", 404)
    }
}

export const remove = async (req, res) => {
    const { id } = req.body
    const user = await User.findByIdAndDelete(id)
    if (!user) throw new ExpressError("User doesn't exist", 404)
    res.status(200).json({
        message: "Account deleted successfully",
        data: user
    })
}

export const addHistory = async (req, res) => {
    const { id, chapterId, exercises, duration, actualDuration } = req.body

    // get user
    const user = await User.findById(id)
    if (!user) throw new ExpressError("User doesn't exist", 404)
    let xp = 0

    // append to history
    for (const exerciseId of exercises) {
        // exerciseId exists
        let exercise
        try {
            exercise = await Exercise.findById(exerciseId)
        } catch (e) {
            throw new ExpressError(`Exercise with the id of ${exerciseId} doesn't exist`, 404)
        }
        // validate that exercise is related to chapter
        if (!exercise.chapter.equals(chapterId)) throw new ExpressError("This exercise isn't part of the chapter", 400)

        // append exerciseId to user.history.exercises
        user.history.exercises.push(exerciseId)
        xp += exercise.xpCount
    }

    // create chapter data
    const chapter = {
        chapter: chapterId,
        exercises,
        xp,
        duration,
        actualDuration
    }
    user.history.courses.push(chapter)
    user.xp += xp

    // save user
    await user.save()

    // send new user
    res.status(200).json({
        message: "History updated successfully",
        data: user
    })
}

export const update = async (req, res) => {
    const { id, userName, classId } = req.body

    const updatedUser = await User.findByIdAndUpdate(id, {userName, class: classId}, {new: true})

    res.status(200).json({
        message: "User updated successfully",
        data: updatedUser
    })
}

export default {
    get,
    remove,
    addHistory,
    update
}