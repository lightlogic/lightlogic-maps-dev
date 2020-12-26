const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  uri: { type: String, required: true },
  description: { type: String, required: true },
  wktGeometry: { type: String },
  projection: { type: String },
});

module.exports = mongoose.model('Feature', featureSchema);
