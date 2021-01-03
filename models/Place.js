const mongoose = require("mongoose");
const validator = require("validator");


const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    /*adress: {
        type: String,
        required: false,
        trim: true,
    },
    location: {
        type: String,
        required: false,
        trim: true,
    },*/
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email nije validan")
            }

        }
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    seats:[
        
        {
            maxPeople:{
                type: Number,
                required: false,
                validate(value){
                    if(value<=0){
                        throw new Error("Broj manji od nule");
                    }
                }
            },
            maxFree:{
                type: Number,
                required: true,
                validate(value){
                    if(value<=0){
                        throw new Error("Broj manji od nule");
                    }
                },
                
            },
            taken:{
                type: Number,
                required: false,
                default: 0,
                validate(value){
                    if(value>this.maxFree){
                        throw new Error("Nema više mjesta");
                    }
                },
                
            }
        
    }
    ],
    picture: {
        type: Buffer,
    },
}, 
{
    timestamps: true,
});

 

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;