const { promisify } = require('util');
const User = require("../models/user");
const placeController = require('./../controllers/placeController'); 
const Reservation = require("../models/reservation");
const Place = require("../models/place");


exports.createAReservation= async (req,res)=>{
    const maker = req.user._id;
    const place = req.params.idRestaurant;
    const seat = req.params.idSeat;

    await Reservation.create({
        maker, 
        place,
        seat
    });

    res.redirect("/places");
}

exports.getAllReservationsByUser = async(req,res)=>{
      
    try{
        console.log("sd")
            const reservations =  await Reservation.findOne({ maker: req.user._id }).populate({
                path: 'places',
                select: "name"
              }).exec();
             
            
        console.log("sdds"+reservations)
         res.render("reservationsByUser",{
            reservations,
            status: req.user.status
        });

    }
    catch(e){
        res.status(500).send(e);
    }

}