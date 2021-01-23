const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const colors = require("colors")

const ListItem = require("../models/listItem");
const geodataLDGeoAdminUtils = require("../utils/3rdPartyData/geodata-LDGeoAdmin-utils");

router.use(bodyparser.json());

// method GET (all listItems from one specific list)
// path: /api/lists:{itemType}
router.get("/:itemType", (req, res, next) => {
  ListItem.find({ itemType: req.params.itemType }).then((documents) => {
    res.status(200).json({
      message: "All lists items of type " + req.params.itemType + " fetched",
      items: documents,
    });
  });
});

router.patch("", (req, res, next) => {
  if (req.body.itemTypeValue == 'commune') {
    geodataLDGeoAdminUtils.getCommunesSwitzerland(
      req.body.itemTypeValue,(error, listItemsData) => {
      res.status(201).json({
        message: "All lists items of type " + req.body.itemTypeValue + " retrieved from datasource.",
        items: null,
      });
    })
  } else {
    res.status(501).json({
      message: "Not implemented for this type yet.",
      items: null,
  })}
});

module.exports = router;
