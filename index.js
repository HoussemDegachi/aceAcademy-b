import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/Auth.js"
import exerciseRoutes from "./routes/Exercise.js"
import chapterRoutes from "./routes/Chapter.js"
import subjectRoutes from "./routes/Subject.js"
import classRoutes from "./routes/Class.js"
import userRoutes from "./routes/User.js"
import mongoSanitize from "express-mongo-sanitize"
import cors from "cors";

const app = express();

// connect to db
mongoose.connect(process.env.DB_URL).then(() => {
  console.log("DB connected")
})

// config
app.use(express.json());
app.use(cors());
app.use(mongoSanitize({
  replaceWith: "_",
  allowDots: true
}))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes
app.use("/auth", authRoutes)
app.use("/exercise", exerciseRoutes)
app.use("/chapter", chapterRoutes)
app.use("/subject", subjectRoutes)
app.use("/class", classRoutes)
app.use("/user", userRoutes)

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route wasn't found"
  })
})

app.use((err, req, res, next) => {
  console.log(err.stack)
  if (!err.message) err.title = "An error occured"
  if (!err.status) err.status = 500
  res.status(err.status).json({
    message: err.message,
  })
  next()
})

// run server
app.listen(process.env.PORT);