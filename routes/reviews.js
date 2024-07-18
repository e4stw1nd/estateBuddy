const express = require('express');
const router = express.Router({ mergeParams: true });

const Estate = require('../models/estate');
const Review = require('../models/review');

const { reviewSchema } = require('../utils/schemas.js');


const AppError = require('../utils/AppError');
const AsyncError = require('../utils/AsyncError');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}



router.post('/', validateReview, AsyncError(async (req, res) => {
    const estate = await Estate.findById(req.params.id);
    const review = new Review(req.body.review);
    Estate.reviews.push(review);
    await review.save();
    await estate.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/estates/${estate._id}`);
}))

router.delete('/:reviewId', AsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Estate.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/estates/${id}`);
}))

module.exports = router;