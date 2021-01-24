const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const colors = require("colors")

const ListItem = require("../models/listItem");
const checkAuth = require("../middleware/check-auth")
const geodataLDGeoAdminUtils = require("../utils/3rdPartyData/geodata-LDGeoAdmin-utils");
const wikidataUtils = require("../utils/3rdPartyData/data-wikidata-utils");

const COMMUNE_TYPE = process.env.ADMINUNIT_TYPE;
const RIVER_TYPE = process.env.RIVER_TYPE;

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

router.patch("", checkAuth, (req, res, next) => {
  if (req.body.itemTypeValue == COMMUNE_TYPE) {
    geodataLDGeoAdminUtils.getCommunesSwitzerland(
      req.body.itemTypeValue,(error, listItemsData) => {
        listItemsData.forEach(commune => {
          newItem = new ListItem ({
           itemType: req.body.itemTypeValue,
           label: commune.label.value,
          })
          newItem.save()
        });
      res.status(201).json({
        message: "All lists items of type " + req.body.itemTypeValue + " retrieved from datasource.",
        items: null,
      });
    })
  } else if (req.body.itemTypeValue == RIVER_TYPE) {
    wikidataUtils.getWikidataCHrivers(
      req.body.itemTypeValue,(error, listItemsData) => {
        listItemsData.forEach(river => {
          newItem = new ListItem ({
           itemType: req.body.itemTypeValue,
           label: river.riverLabel.value
          })
          newItem.save()
        });
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

router.delete("/:itemType", checkAuth, (req, res, next) => {
  if (req.params.itemType == COMMUNE_TYPE || req.params.itemType == RIVER_TYPE) {
    ListItem.deleteMany({ itemType: req.params.itemType }).then((documents) => {
      res.status(200).json({
        message: "Deleted all items of type " + req.params.itemType,
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
