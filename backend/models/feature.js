const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  uri: { type: String, required: true },
  description: { type: String },
  wktGeometry: { type: String },
  geoJSONraw: { type: Object},
  projection: { type: String },
  selected: { type: Boolean },
});

module.exports = mongoose.model("Feature", featureSchema);
