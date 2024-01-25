const express = require("express");
const router = express.Router();
const asyncWrap = require("../utilities/asyncWrap.js");
const { isLoggedIn,isOwner,validateLisiting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//Index route & post route
router
    .route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateLisiting,asyncWrap(listingController.postListing));

//Create Route
router.get("/new",isLoggedIn,listingController.createRender);

//Show, update and delete routes
router
    .route("/:id")
    .get(asyncWrap(listingController.show))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateLisiting,asyncWrap(listingController.editListing))
    .delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.editRender));

module.exports = router;