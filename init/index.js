const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {  // here we use async function to make sure that the database is connected before we try to insert data into it
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: "6aa466aa83b6865712cb522a"}));
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample listings");
};

initDB(); // Call the initDB function to initialize the database with sample listings