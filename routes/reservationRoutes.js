const express = require('express');
const authController = require('./../controllers/authController'); 
const reservationController = require('./../controllers/reservationController'); 

const router = express.Router();
 
router
.route("/")
.get(authController.protect, reservationController.getAllReservationsByUser);

router
.route("/create/:idRestaurant/:idSeat")
.get(authController.protect, authController.restrictTo("korisnik"), reservationController.createAReservation)
 
//router
//.post("/:id/confirm", authController.protect, authController.restrictTo("vlasnik"), reservationController.confirmAReservation)
//router
//.post("/:id/remove", authController.protect, authController.restrictTo("vlasnik"), reservationController.removeAReservation)

module.exports = router;