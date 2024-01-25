const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const MyError = require("./utilities/MyError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You are not LoggedIn!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Can't perform this operation");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateLisiting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(", ");
        console.log(errMsg);
        throw new MyError(400,errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        console.log(errMsg);
        throw new MyError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let currReview = await Review.findById(reviewId);
    if(!currReview.author.equals(res.locals.currUser._id)){
        req.flash("error","Author not verified");
        return res.redirect(`/listings/${id}`);
    }
    next();
}