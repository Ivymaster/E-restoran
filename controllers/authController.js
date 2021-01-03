const { promisify } = require('util');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createJWToken =  function(id, username){
    const token =  jwt.sign({id, username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME ,
    });
    return token;
}
 
exports.signUp = async(req,res, next)=>{
    //Kreiranje novog usera, i dodavanje u bazu
    const user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        status: req.body.status,
    });
    
    //Kreiranje tokena za kolačić, kako bi se omogućila autentifikacija usera
    const token =  jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME ,
    });
     
    //slanje kolacica, koji predstavlja mehanizam autentifikacije
    res.cookie("jwt", token,{
        expiresIn: new Date(
            Date.now() + process.env.JWT_EXPIRE_TIME *24*60*60*1000
        ),
        httpOnly: true,  
    });
    res.cookie("status", user.status,{
        httpOnly: true,  
    });
    //Undefiniranje šifre, kako se ne bi slala u responsu
    user.password = undefined;
    res.status(200).render("index", {
        status: user.status,
    });
}

exports.logOut = (req, res) => {
    //Salje se dummy cookie s brzim istekom vremena, koji zamjenjuje postojeći kolačić
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true
    });
    res.cookie('status', 'none', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
      });
    res.status(200).render("index", {
        status: "none"
    });
};

exports.logIn = async(req, res)=>{
    const {username, password} = req.body;

    const user = await User.find({username});
   
     // Ako ne postoji user, ili se šifre ne poklapaju
    if(!user || !await bcrypt.compare(password, user[0].password)){
       return  new Error("Name or password incorrect");
    }
    //Kreiranje kolačića i tokena
    const token =  jwt.sign({id: user[0]._id, username: user[0].username}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME ,
    });
     
    res.cookie("jwt", token,{
        expiresIn: new Date(
            Date.now() + process.env.JWT_EXPIRE_TIME *24*60*60*1000
        ),
        httpOnly: true,  
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    res.cookie("status", user[0].status,{
        expiresIn: new Date(
            Date.now() + process.env.JWT_EXPIRE_TIME *24*60*60*1000
        ),
        httpOnly: true,  
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    user.password = undefined;
    res.status(200).render("index", {
        user:user[0],
        status: user[0].status
    });

}

exports.protect = async(req,res, next)=>{
    if(req.cookies.jwt){
        const token = req.cookies.jwt;

        if(!token){
            return new Error("Please log in...");
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        //ako user ne postoji
        if(!user){
            return new Error("Please log in...");
        }

        //ako je password promijenjen nakon izdavanja tokena
        if(user.passwordChangedDateComp(decoded.iat)){
            return new Error("Password changed. Please log in...");
        }

        //dodavanje pristupa
        req.user = user;
        res.locals.user = user;
        
        next();
    }
    else{
        return new Error("Please log in...");
    }
}

exports.restrictTo= (...roles)=>{
    //Authorisation for user
    //RestrictTo je wrapper funkcija, vraća middleware
    return (req,res,next)=>{
        
        if(!roles.includes(req.user.status)){
            return Error("Not authorised for this action!!");
        }
        res.locals.user = req.user;
        next();
    }
}