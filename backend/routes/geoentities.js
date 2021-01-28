const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const bodyparser = require("body-parser");
router.use(bodyparser.json());

const {
  getGeoentities,
  getGeoentity,
  toggleGeoEntitySelection,
  deleteGeoEntity,
  addAdminUnit,
  addRiver,
} = require("../controllers/geoentities");


// GeoEntities Routes
router.route("").get(getGeoentities);

router
  .route("/:id")
  .get(getGeoentity)
  .patch(toggleGeoEntitySelection)
  .delete(checkAuth, deleteGeoEntity);

router.route("/swisstopo/adminunit").post(checkAuth, addAdminUnit);

router.route("/swisstopo/river").post(checkAuth, addRiver);

module.exports = router;
