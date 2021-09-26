const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchError = require('../helpers/cathcError');
const isLoggedIn = require('../isLoggedIn');
const reviewsControllers = require('../controllers/reviews')


//crating reviews
router.post('/campgrounds/:id/reviews', isLoggedIn, reviewsControllers.createReviews)

//delete a reviews
router.delete('/campgrounds/:reviewId', isLoggedIn, catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;