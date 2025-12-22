const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListings;
  let { category, search } = req.query;

  if (category) {
    allListings = await Listing.find({ category: { $eq: category } });
  } else if (search) {
    allListings = await Listing.find({
      location: { $regex: search, $options: "i" },
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      req.body.listing.location
    )}`,
    {
      headers: { "User-Agent": "my-wandernest-app" },
    }
  );
  const data = await response.json();

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);

  let url = req.file.path;
  let filename = req.file.filename;

  // let {title, description, image, price, country, location } = req.body;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat],
  };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      req.body.listing.location
    )}`,
    {
      headers: { "User-Agent": "my-wandernest-app" },
    }
  );
  const data = await response.json();

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  req.body.listing.geometry = {
    type: "Point",
    coordinates: [lon, lat],
  };

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

// module.exports.searchListings = async (req, res) => {
//   let { search } = req.query;
//   const allListings = await Listing.find({
//     location: { $regex: search, $options: "i" },
//   });
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.filterListings = async (req, res) => {
//   let { category } = req.query;
//   const allListings = await Listing.find({ category: { $eq: category } });
//   res.render("listings/index.ejs", { allListings });
// };
