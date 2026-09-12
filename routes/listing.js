const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js")
const upload = multer({storage});

// Search route — MUST be above /:id
router.get("/search", wrapAsync(listingController.searchListings));

router
    .route("/")
    .get(wrapAsync(listingController.index))    // INDEX ROUTE
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing)  //CREATE ROUTE
);


// NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewform);


router
    .route("/:id")
    .get( wrapAsync( listingController.showListing ))  // SHOW ROUTE
    .put(isLoggedIn, isOwner ,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))  // UPDATE ROUTE
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;