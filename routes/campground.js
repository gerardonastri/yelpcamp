const express = require('express');
const router = express.Router();
const catchError = require('../helpers/cathcError')
const Campground = require('../models/campground');
const isLoggedIn = require('../isLoggedIn');
const isAuthor = require('../isLoggedIn');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});





//////////////////////////////////////////////////////
//request
router.get('/campgrounds', campgrounds.index)

//creare un nuovo campground
router.get('/campgrounds/new', isLoggedIn, campgrounds.renderNewForm)

//aggiungere il campground creato
router.post('/campgrounds', isLoggedIn, upload.array('image'), campgrounds.createNewCamp)


//mostrare un unico camp
router.get('/campgrounds/:id', campgrounds.showCamp)

//modificare un campground 
router.get('/campgrounds/:id/edit', isLoggedIn, campgrounds.editForm)

//update campground
router.put('/campgrounds/:id',isLoggedIn, isAuthor, upload.array('image'), campgrounds.updateCamp)

//delete campground
router.delete('/campgrounds/:id', isLoggedIn, isAuthor, campgrounds.deleteCamp)

module.exports = router;