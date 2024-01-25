const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_API_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.createRender = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.postListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = req.body.listing;
    let createListing = new Listing(newListing);
    createListing.owner = req.user._id;
    createListing.image = { url, filename};
    createListing.geometry = (response.body.features[0].geometry);
    await createListing.save();
    req.flash("success", "Listing added succesfully");
    res.redirect("/listings");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const currListing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (!currListing) {
        req.flash("error", "Listing doesnot exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { currListing });
}

module.exports.editRender = async (req, res) => {
    let { id } = req.params;
    let currListing = await Listing.findById(id);
    if (!currListing) {
        req.flash("error", "Listing doesnot exist");
        res.redirect("/listings");
    }
    let previewUrl = currListing.image.url;
    previewUrl = previewUrl.replace("/upload", "/upload/w_200/e_blur:200");
    res.render("listings/edit.ejs", { currListing, previewUrl });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let newListing = req.body.listing;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    })
        .send()

    let currListing = await Listing.findByIdAndUpdate(id, newListing);
    currListing.geometry = response.body.features[0].geometry;
    await currListing.save();
    // for uploaded file 
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        currListing.image = { url, filename };
        await currListing.save();
    }
    req.flash("success", "Listing edited");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}