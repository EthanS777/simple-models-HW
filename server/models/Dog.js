const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
  // name, breed, age (number), created date (date)
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: String,
    required: true,
    trim: true,
  },

  age: {
    type: Number,
    required: true,
    min: 0,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const DogModel = mongoose.model('Dog', DogSchema);

module.exports = DogModel;
