import mongoose from "mongoose";
import uploadImage from "../cloudinary/index.js";
import Subject from "../models/Subject.js";
import exercisesData from "./data.json" with {type: "json"}
import Exercise from "../models/Exercise.js";
import Chapter from "../models/Chapter.js";
import sizeOf from "image-size"
import Class from "../models/Class.js";

// uploadImage("../seeds/temp/programming.png", "logo")
//     .then((data) => console.log(data))


mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to DB")
})

const imageBase = "../seeds/"

const createSubject = async (name, logo) => {
    const image = await uploadImage(logo, "logo")
    const newSubject = new Subject({name})
    console.log(image)
    newSubject.logo = {
        filename: image.public_id,
        url: image.secure_url,
    }
    await newSubject.save()
    return newSubject._id
}

const createChaptersAndExercises = async (data) => {
    const ids = []
    for (let item in data) {
        console.log(`creating chapter ${item}`)
        const itemData = data[item]
        const newChapter = new Chapter({name: item, trimester: itemData.trimester, order: itemData.order})
        newChapter.course.videos = itemData.cours.videos

        for (let exercise of itemData.exercises) {
            console.log(`creating ${exercise} for ${item}`)
            const imageData = await uploadImage(`${imageBase}${exercise}`, "2tech/physics")
            const newExercise = new Exercise()
            newExercise.image = {
                filename: imageData.public_id,
                url: imageData.secure_url
            }
            const dimentions = sizeOf(exercise)
            newExercise.xpCount = dimentions.height * 0.2
            newExercise.chapter = newChapter._id
            newChapter.exercises.push(newExercise._id)
            await newExercise.save()
            console.log(`created ${exercise} for ${item} created successfully`)
        }
        
        ids.push(newChapter._id)
        await newChapter.save()
        console.log(`created chapter ${item} successully`)
    }
    return ids
}

const append = async (to, items) => {
    const target = await Subject.findById(to)
    for (let item of items) {
        target.chapters.push(item)
    }
    await target.save()
}

const createClassesAndAppend = async (classes, subjects) => {
    for (const itemClass of classes) {
        console.log(itemClass)
        const newClass = new Class(itemClass)
        for (let subject of subjects) {
            newClass.subjects.push(subject)
        }
        await newClass.save()
    }
}

const findClassesAndAppend = async (classes, subjects) => {
    for (const classCondition of classes) {
        const sClass = await Class.findOne(classCondition)
        for (let subject of subjects) {
            sClass.subjects.push(subject)
        }
        await sClass.save()
    }
}

const seedDB = async () => {
    console.log("Creating Subjects")
    const subjectId = await createSubject("Physique", `${imageBase}temp/physics.png`)
    console.log("Subject created successfully")
    console.log("Creating CHapters and exercises")
    const chapters = await createChaptersAndExercises(exercisesData)
    console.log("Chapters and exercises created succesfully")
    console.log("Appending")
    await append(subjectId, chapters)
    console.log("Appended successfully")
    await findClassesAndAppend([{_id: "6650741b202fa18d56f6abdd"}, {_id: "6650741b202fa18d56f6abdf"}], [subjectId])
    // await createClassesAndAppend([{name: "2 تكنولوجيا", orientation: "technology", grade: 2, state: "Secondary"}, {name: "2 علوم", orientation: "science", grade: 2, state: "Secondary"}], [subjectId])
}

seedDB().then(() => {
    console.log("Success")
    mongoose.connection.close()
})