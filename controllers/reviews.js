const Review = require("../models/review");
const Place = require("../models/place")


module.exports.createReview = async (req, res) => {
    const place = await Place.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/happy-place/${place._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/happy-place/${id}`);
}