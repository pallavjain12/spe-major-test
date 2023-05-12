const Chainagri = require("../models/chainagri");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    chainagri.reviews.push(review);
    await review.save();
    await chainagri.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/happy-place/${chainagri._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Chainagri.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/happy-place/${id}`);
}