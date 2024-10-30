// require mongoose, a popular MongoDB library for nodejs
const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  bedsOwned: {
    type: Number,
    min: 0,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});
// Create the cat model based on the schema. You provide it with a custom discriminator
// (the name of the object type. Can be anything)
// and the schema to make a model from.
const CatModel = mongoose.model('Cat', CatSchema);

// Export
module.exports = CatModel;
