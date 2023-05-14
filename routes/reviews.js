const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require("../utils/catchAsync");
const { createReview, deleteReview } = require("../controllers/reviews");





router.post('/',isLoggedIn, validateReview, catchAsync(createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(deleteReview))

module.exports = router;