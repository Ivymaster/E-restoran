const { promisify } = require('util');
const Place = require("../models/place");

exports.getAllPlaces = async function (req,res){
    const places = await Place.find({});
    const status = req.cookies.status;
    res.render("places", {
        places,
       status
    });
}

exports.createPlace = async (req,res, next)=>{
    const {name, email, stock} = req.body;
    const people = req.body.seats;
    const seat = {
        maxPeople: people,
        maxFree: stock,
    }
   
    let seats = new Array();
    seats.push(seat);
    
    const place = await Place.create({
        name,
        email,
        owner:req.user._id,
        seats
    });
    next();
}
exports.showOnePlace = async (req,res)=>{
    const place = await Place.findById(req.params.id);
    if(!place){
        return res.send("Error");
    } 
    place.seats.status = req.cookies.status;
    res.render("SinglePlace", {
        place,
        status: req.cookies.status
    })
}

exports.deletePlaceById = async (req,res) =>{
    placeId = req.param.id;
    await Place.deletePlaceById(placeId)
}