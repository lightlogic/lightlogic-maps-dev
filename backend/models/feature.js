const { stringify } = require("@angular/compiler/src/util");
const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
  id: { type: String, required: true },
  uri: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  wktGeometry: { type: String },
  projection: { type: String },
});

module.export = mongoose.model('Feature', featureSchema);
