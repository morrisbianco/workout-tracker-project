// Setting up the Workout Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  // Day to mark the date of the workout
  day: {
    type: Date,
    default: Date.now
  },
  // Exercises contains all of the additional information for the workout
  exercises: [{
    type: {
      type: String
    },
    name: {
      type: String,
      trim: true,
      required: "Workout Name is Required"
    },

    duration: {
      type: Number,
      trim: true,
    },

    weight: {
      type: Number,
      trim: true,
    },

    reps: {
      type: Number,
      trim: true,
    },

    sets: {
      type: Number,
      trim: true,
    },
    distance: {
      type: Number,
      trim: true,
    }
  }]
});

// names and exports the workout model
const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;