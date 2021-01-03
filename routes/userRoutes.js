const express = require('express');
const authController = require('./../controllers/authController'); 

const router = express.Router();

router
.route("/signUp")
.get((req,res)=>{res.render("signUp");})
.post( authController.signUp)

router.get("/logOut", authController.logOut);

router
.route("/logIn")
.get((req,res)=>{res.render("logIn");})
.post(authController.logIn)

 
module.exports = router;