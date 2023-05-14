const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware');
const place = require('../controllers/place');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });





router.route('/')
    .get(catchAsync(place.index))
    .post(isLoggedIn,upload.array('image'),validatePlace, catchAsync(place.createPlace))

router.get('/new',isLoggedIn, place.renderNewForm)

router.route('/:id')
    .get( catchAsync(place.showPlace))
    .put(isLoggedIn,isAuthor,upload.array('image'),validatePlace, catchAsync(place.updatePlace))
    .delete(isLoggedIn,isAuthor,catchAsync(place.deletePlace))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(place.renderEditForm))

module.exports = router;