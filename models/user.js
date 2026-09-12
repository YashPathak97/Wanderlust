const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose"); // This is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema = new schema({
    email: {
        type: String,
        required: true,
    },
    // username and password will be added by passport-local-mongoose plugin
});

userSchema.plugin(passportLocalMongoose.default);  // automatically adds a username, hash and salt field to store the username, the hashed password and the salt value. It also adds some methods to the schema for password hashing and authentication.

module.exports = mongoose.model("User", userSchema);