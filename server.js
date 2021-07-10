// Requiring path for the site pathways
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000

// Assigning the model exports to the variable DB
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
// route to load the exercise page
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'))
});
// route to load the stats page
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'))
});
// Loads the last workout and displays the stats on the main page
app.get("/api/workouts", (req, res) => {
  const workoutDuration = { totalDuration: { $sum: "$exercises.duration" }};
  db.Workout.aggregate([{ $set: workoutDuration }])
  .then(dbWorkout => {
    res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// Updates the currently loaded workout when continue workout is pressed
app.put("/api/workouts/:id", (req, res) => {
  db.Workout.findOneAndUpdate({_id: req.params.id}, { $push: { exercises: req.body } }, { new: true })
    .then(dbWorkout => {
      console.log("data", req.body);
      console.log(dbWorkout.exercises);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

// creates a new workout when create a workout is pressed
app.post("/api/workouts", ({ body }, res) => {
  db.Workout.create( body )
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});

// Loads in the workouts for the stats page
app.get("/api/workouts/range", (req, res) => {
  const workoutDuration = { totalDuration: { $sum: "$exercises.duration" }};
  db.Workout.aggregate([{ $set: workoutDuration }])
  .then(dbWorkout => {
    res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});