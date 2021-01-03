

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
         
        validate(value){
            if(!validator.isAlphanumeric(value)){
                return new Error("Šifra mora sadržavatislova i brojeve")
            }
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email nije validan")
            }

        }
    },
    status: {
        type: String,
        required: true,
        enum: ["admin", "vlasnik", "korisnik"]
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 || value>200) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    avatar: {
        type: Buffer,
    },
    passwordChangedAt: Date,
}, 
{
    timestamps: true,
});
 
userSchema.methods.passwordChangedDateComp = function(JWTimestamp){
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
          this.passwordChangedAt.getTime() / 1000,
          10
        );
    
        return JWTTimestamp < changedTimestamp;
      }
    
      return false;
}

userSchema.virtual("reservations", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "maker"
})

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 9);
    }
    next();
}) 
 

const User = mongoose.model("User", userSchema);
module.exports = User;