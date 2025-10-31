const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2024/07/12/22/26/ai-generated-8891135_1280.png",
    set: (v) =>
      v === ""
        ? "https://cdn.pixabay.com/photo/2024/07/12/22/26/ai-generated-8891135_1280.png"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
