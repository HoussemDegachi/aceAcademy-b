import Class from "../models/Class.js"
import ExpressError from "../utils/ExpressError.js"

const getAll = async (req, res) => {
    const classes = await Class.find({})
    res.status(200).json({
        message: "Classes were found successfully",
        data: classes
    })
}

const get = async (req, res) => {
    const { id } = req.params

    // find class and validate existence
    const classData = await Class.findById(id).populate("subjects")
    if (!classData) throw new ExpressError("Class wasn't found", 404) 

    // send class
    res.status(200).json({
        message: "Class was found successfully",
        data: classData
    })
}

export default {
    getAll,
    get
}
