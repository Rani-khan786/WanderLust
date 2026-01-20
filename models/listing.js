const mongoose = require("mongoose");
const { Schema } = mongoose;
const categories = require("../utils/categories.js");

//  Define Listing Schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  location: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
   category: {
    type: String,
    enum: categories,
    
  },
  reviews : [
    {
      type : Schema.Types.ObjectId, 
      ref : "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// ✅ Create and export model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;