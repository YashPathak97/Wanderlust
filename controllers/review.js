const Listing = require("../models/listing");
const Reviews = require("../models/review")


module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);  // params.id  hmne isliye use kiya kyuki url me id h listing ka
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created!");

    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  // pull is used to remove from an existing array
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);  // redirect to the listing page after deleting the review
};