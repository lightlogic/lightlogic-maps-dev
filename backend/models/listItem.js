const mongoose = require("mongoose");

const listItemSchema = mongoose.Schema({
  itemType: { type: String, required: true },
  label: { type: String, required: true },
  lang: { type: String, required: true, default: "fr" },
});

module.exports = mongoose.model("ListItem", listItemSchema);
