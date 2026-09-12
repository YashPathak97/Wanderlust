const Joi = require('joi');

// we use joi to validate the data that we get from the user before we save it to the database. This is a good practice to ensure that the data is in the correct format and that required fields are present.
module.exports.listingSchema = Joi.object({  
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object().allow("",null)
    }).required()
});

module.exports.reviewSchema = Joi.object({  //server side validation is done because client side validation can be bypassed by the user. So we need to validate the data on the server side as well.
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})


// Schema.js file is created because we want to validate the data that 
// we get from the user before we save it to the database.
//  This is a good practice to ensure that the data is in the correct format 
// and that required fields are present. We use joi to validate the data.