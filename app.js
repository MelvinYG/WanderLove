if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MyError = require("./utilities/MyError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listingRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const userRouter = require("./routes/userRoute.js");

const dburl=process.env.ATLASDB_URL;

//DB setup
main()
    .then((res)=>{
        console.log("Connected to database");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
  await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("Mongo session store error", err);
});

const sessionOptns = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7*24*3600*1000,
        maxAge: 7*24*36000*1000,
        httpOnly: true
    }
};

app.use(session(sessionOptns));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

//For all error paths
app.all("*", (req,res,next)=>{
    next(new MyError (404,"Page not found"));
});
//Error handling
app.use((err,req,res,next)=>{
    let {status = 500 , message = "Something went wrong"} = err;
    res.status(status).render("listings/error.ejs", {message});
});

//port setup
app.listen("8080",()=>{
    console.log("Listening to port 8080");
});