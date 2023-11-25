const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: { type: String, unique: true }, // Add unique constraint
  course: String,
  category: String,
  fees: Number,
});

module.exports = mongoose.model('FormData', formDataSchema);
