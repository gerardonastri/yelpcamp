const Campground = require('../models/campground');
const Review = require('../models/review');
const catchError = require('../helpers/cathcError');

module.exports.createReviews = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}