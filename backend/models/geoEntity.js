const mongoose = require("mongoose");

const geoEntitySchema = mongoose.Schema({
  uri: { type: String, required: true },
  isA: { type: String },
  domainId: { type: Number, unique: true },
  domainIdLabel: { type: String },
  description: { type: String, unique: true },
  parentUri: { type: String },
  parentLabel: { type: String },
  selected: { type: Boolean, default: true },
  geoJSON: { type: Array },
});

module.exports = mongoose.model("GeoEntity", geoEntitySchema);
