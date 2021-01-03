const express = require('express');
const authController = require('../controllers/authController'); 
const placeController = require('../controllers/placeController'); 

const router = express.Router();

router
.route("")
.get(placeController.getAllPlaces) 

router
.route("/create")
.get((req,res)=>{res.render("createPlace")})
.post(authController.protect, authController.restrictTo("admin"), placeController.createPlace, placeController.getAllPlaces)

router.get("/:id", placeController.showOnePlace)

router.get("/:id/delete", placeController.deletePlaceById)



 
module.exports = router;