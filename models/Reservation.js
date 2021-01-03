const mongoose = require("mongoose");
const validator = require("validator");


const reservationSchema = new mongoose.Schema({
    deadline: {
        type: Date,
        required: false,
        trim: true,
    },
    place:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Place",
    },
    seat:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Seat",
    },
    maker:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    picture: {
        type: Buffer,
    },
    confirmed:
    {
        type:Boolean,
        required: false,
        default: false,
    }
}, 
{
    timestamps: true,
});
reservationSchema.virtual("places", {
    ref: "Place",
    localField: "place",
    foreignField: "_id"
})

reservationSchema.virtual("places", {
    ref: "Place",
    localField: "place",
    foreignField: "_id"
})

reservationSchema.set('toObject', { virtuals: true });
reservationSchema.set('toJSON', { virtuals: true });

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;