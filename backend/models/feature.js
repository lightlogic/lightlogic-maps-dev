const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  featureOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GeoEntity",
    required: true,
  },
  geoJSON: [
    {
      geometry: {
        type: String,
        coordinates: Array
      },
      layerBodId: String,
      bbox: Array,
      featureId: Number,
      type: String,
      featureId: Number,
      properties: {
        name: String,
      },
    },
  ]
});

module.exports = mongoose.model("Feature", featureSchema);
