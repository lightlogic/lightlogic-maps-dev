const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");

const ListItem = require("../models/listItem");

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

module.exports = router;
