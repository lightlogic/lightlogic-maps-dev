const mongoose = require("mongoose");

const adminUnitSchema = mongoose.Schema({
  uri: { type: String, required: true },
  bfsNum: { type: Number, unique: true },
  type: { type: String },
  name: { type: String, unique: true },
  parentUri: { type: String },
  parentName: { type: String },
});

module.exports = mongoose.model("AdminUnit", adminUnitSchema);
