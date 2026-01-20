const Listing = require("../models/listing");
const categories = require("../utils/categories");

/* INDEX */
/* INDEX */
module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  // category filter
  if (category && category.trim() !== "") {
    filter.category = category;
  }

  // search filter
  if (search && search.trim() !== "") {
    filter.title = { $regex: search.trim(), $options: "i" };
  }

  const allListings = await Listing.find(filter);

  // ✅ If user searched/filtered and no results found → redirect + flash
  if (allListings.length === 0 && (search || category)) {
    req.flash("error", "No listings found!");
    return res.redirect("/listings");
  }

  // ✅ Normal render
  return res.render("listings/index.ejs", {
    allListings,
    activeCategory: category || "",
    search: search || "",
  });
};


/* NEW FORM */
module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new.ejs", { categories });
};

/* SHOW */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  return res.render("listings/show.ejs", { listing });
};

/* CREATE */
module.exports.createListing = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Image upload failed");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };

  await newListing.save();

  req.flash("success", "New Listing created!");
  return res.redirect("/listings");
};

/* EDIT FORM */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url.replace(
    "/upload",
    "/upload/h_300,w_250"
  );

  return res.render("listings/edit.ejs", {
    listing,
    originalImageUrl,
    categories,
  });
};

/* UPDATE */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
    runValidators: true,
  });

  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  return res.redirect(`/listings/${listing._id}`);
};

/* DELETE */
module.exports.destroyListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing deleted!");
  return res.redirect("/listings");
};
