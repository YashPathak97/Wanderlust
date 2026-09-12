const User = require("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("user/signup.ejs");
};

module.exports.signUp = async (req,res) => { 
    try{
        let {username,email,password} = req.body;  // Destructuring the request body to get username, email and password
        let newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password)  // This will hash the password and store it in the database.
        req.login(registeredUser, (err)=>{ 
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to the App!");  // This will set a flash message to be displayed on the next page.
            res.redirect(req.session.redirectUrl || "/listings");
        })
    } catch (err) {
        req.flash("error", err.message);  // This will set a flash message to be displayed on the next page.
        res.redirect("/signup");  // Redirect to the signup page after failed signup.
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("user/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};