const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let data = req.body.review;
    let currListing = await Listing.findById(id);
    if(!currListing){
        req.flash("error","Listing unavailable");
    }
    let newReview = new Review(data);
    newReview.author = req.user._id;
    currListing.reviews.push(newReview);
    await newReview.save();
    await currListing.save();
    req.flash("success","Review added");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);
}