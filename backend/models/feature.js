const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  geoJSONraw: { type: Object },
  projection: { type: String, default: "EPSG:2056" },
  selected: { type: Boolean, default: true },
  featureOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUnit",
    required: true,
  },
  featureOfId: { type: Number },
  featureId: { type: Number },
  featureOfLabel: { type: String },
  bbox: [{ type: Number }],
  layerBodId: { type: String },
  layerName: { type: String },
});

module.exports = mongoose.model("Feature", featureSchema);
