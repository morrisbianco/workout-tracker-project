const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000

const db = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'))
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'))
});

app.get("/api/workouts", (req, res) => {
  const workoutDuration = { totalDuration: { $sum: "$exercises.duration" }};
  db.Workout.aggregate([{ $set: workoutDuration }])
  .then(dbWorkout => {
    res.json(dbWorkout);
    console.log(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Workout.update({_id: mongojs.ObjectId(req.params.id)}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
    .then(({_id}) => db.Workout.findOneAndUpdate({}, { $push: { books: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  const workoutDuration = { totalDuration: { $sum: "$exercises.duration" }};
  db.Workout.aggregate([{ $set: workoutDuration }])
  .then(dbWorkout => {
    res.json(dbWorkout);
    console.log(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});