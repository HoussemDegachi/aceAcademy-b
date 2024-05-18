import Subject from "../models/Subject.js";
import ExpressError from "../utils/ExpressError.js";

export const get = async (req, res) => {
    // find subject and verify existence
    const { id } = req.params
    const subject = await Subject.findById(id).populate("chapters")
    if (!subject) throw new ExpressError("Subject doesn't exist", 404)

    // send class
    res.status(200).json({
        message: "Subject was found",
        data: subject
    })
}

export default {
    get
}