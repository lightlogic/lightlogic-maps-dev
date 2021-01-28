const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const bodyparser = require("body-parser");
router.use(bodyparser.json());

const {
  getAllItemsOfOneType,
  deleteAllItemsOfOneType,
  addAllItemsOfOneType,
} = require("../controllers/listitems");

// ListItems Routes
router
  .route("/:itemType")
  .get(getAllItemsOfOneType)
  .delete(checkAuth, deleteAllItemsOfOneType);

router.route("").patch(checkAuth, addAllItemsOfOneType);

module.exports = router;
