const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  geoJSONraw: { type: Object },
  projection: { type: String, default: "EPSG:2056" },
  selected: { type: Boolean, default: false },
  featureOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUnit",
    required: true,
  },
  featureOfLabel: { type: String },
  featureOfbfsNum: { type: Number }
});

module.exports = mongoose.model("Feature", featureSchema);
