const express = require("express");
const router = express.Router({mergeParams : true});
const asyncWrap = require("../utilities/asyncWrap.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//review create route
router.post("/", isLoggedIn,validateReview ,asyncWrap(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isAuthor,asyncWrap(reviewController.destroyReview));

module.exports = router;