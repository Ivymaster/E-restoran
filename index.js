//ugrađeni moduli
const path = require("path");
//samokreirani moduli
require("./db/mongoose");
const userRoutes = require("./routes/userRoutes");
const placeRoutes = require("./routes/placeRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
//instalirani moduli
const express = require("express");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
/////////////////////////////////////

const app = express();
const port = process.env.PORT;

//PUTANJE
const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

//SETUP ZA HANDLEBARS
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
//FOLDER SA STATICNIM ELEMENTIMA
app.use(express.static(publicDirectoryPath));

//POSTAVLJANJE OPCIH MIDDLEWARE's I RUTA
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get("/", (req,res)=>{
    
    if(req.cookies.status){
    return res.render("index", {
        status: req.cookies.status
    });}
    return res.render("index", {
        status: "none"
    });
    
}) 
app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use("/reservations", reservationRoutes);




app.listen(port, ()=>{
    console.log("Server slusa na portu: "+ port)
});