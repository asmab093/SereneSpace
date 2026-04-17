const mongoose = require('mongoose');
const tipSchema = new mongoose.Schema({
  dayIndex: { type: Number, required: true, unique: true },
  text: { type: String, required: true }
});
module.exports = mongoose.model('Tip', tipSchema);