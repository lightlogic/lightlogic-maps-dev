const mongoose = require("mongoose");

const riverSchema = mongoose.Schema({
  uri: { type: String, required: true },
  gewissNum: { type: Number, unique: true },
  type: { type: String },
  name: { type: String, unique: true },
});

module.exports = mongoose.model("River", riverSchema);
