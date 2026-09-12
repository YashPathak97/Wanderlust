const express = require("express");
const router = express.Router({mergeParams:true});  // mergeParams is used to access the params of the parent route in this case /listings/:id/reviews      
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview , isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");


// POST ROUTE FOR REVIEWS
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;