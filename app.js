if(process.env.NODE_ENV != "production")
require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");  // Import the path module
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  // ejsmate is used to make same template on diff pages
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const listingRouter = require("./routes/listing.js"); // here we are importing the routes defined in listing.js and storing it in listings variable
const { reviewSchema } = require("./schema.js");
const userRouter = require("./routes/user.js");  // Import the user routes
// const reviews = require("./routes/review.js"); 


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(methodOverride("_method"));
app.engine('ejs' ,  ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });


store.on("error", () => {
    console.log(err)
});

const sessionOptions = {
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Cookie expires in 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie max age is 7 days
        httpOnly: true, // Cookie is not accessible via client-side JavaScript
    }
}

const store = MongoStore.create({
    mongoUrl:  dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

     
app.use(session(sessionOptions));  // This will add a session object to the request object, which can be used to store data across requests.
app.use(flash());  // This will add a flash object to the request object, which can be used to store temporary messages across requests.


app.use(passport.initialize());  // This will initialize Passport and add it to the request object.
app.use(passport.session());  // This will add a session object to the request object, which can be used to store data across requests.
passport.use(new LocalStrategy(User.authenticate()));  // This will use the authenticate method provided by passport-local-mongoose to authenticate users.

passport.serializeUser(User.serializeUser());  // This will serialize the user object and store it in the session.
passport.deserializeUser(User.deserializeUser());  // This will deserialize the user object and retrieve it from the session.


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.use("/listings" , listingRouter);  // use the routes defined in listing.js for all routes starting with /listings
app.use("/listings/:id/reviews",require("./routes/review.js"));  // use the routes defined in review.js for all routes starting with /listings/:id/reviews
app.use("/", userRouter);  // use the routes defined in user.js for all routes starting with /


app.all("/*splat",(req,res,next)=>{  // IF NO ROUTE MATCHES THEN THIS WILL BE EXECUTED
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{  // MIDDELWARE
   let {statusCode = 500 , message ="Something went wrong!"} = err;
   res.status(statusCode).render("error.ejs",{err});
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
})
