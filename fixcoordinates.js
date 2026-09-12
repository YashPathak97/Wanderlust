require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("./models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});

async function fixCoordinates() {

    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

    console.log("MongoDB connected");

    const listings = await Listing.find({});

    console.log(`Found ${listings.length} listings`);

    for (let listing of listings) {

        try {

            if (
                listing.geometry &&
                listing.geometry.coordinates &&
                listing.geometry.coordinates.length === 2
            ) {
                console.log(`SKIPPED: ${listing.title}`);
                continue;
            }

            console.log(`Fixing: ${listing.title}`);
            console.log(`Location: ${listing.location}`);

            const response = await geocodingClient.forwardGeocode({
                query: listing.location,
                limit: 1
            }).send();

            if (!response.body.features.length) {
                console.log(`❌ Location not found: ${listing.location}`);
                continue;
            }

            const geometry = response.body.features[0].geometry;

            listing.geometry = geometry;

            await listing.save();

            console.log(
                `✅ Fixed: ${listing.title} →`,
                geometry.coordinates
            );

        } catch (error) {

            console.log(
                `❌ Error fixing ${listing.title}:`,
                error.message
            );
        }
    }

    console.log("🎉 Coordinate fixing completed!");

    await mongoose.connection.close();
}

fixCoordinates();