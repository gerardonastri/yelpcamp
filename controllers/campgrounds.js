const Campground = require('../models/campground');
const catchError = require('../helpers/cathcError');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: token})


//mostrare tutti i camp
module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

//creare un nuovo camp
module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
}

//aggiungere il campground creato
module.exports.createNewCamp = catchError(async (req,res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images =  req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
   await campground.save();
   console.log(campground);
   res.redirect(`/campgrounds/${campground._id}`)

})


//mostrare un unico camp
module.exports.showCamp = async (req,res,next) => {
    const campground = await  Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show-one-camp', {campground})
}

//modificare un campground 
module.exports.editForm = catchError(async (req,res,next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
})

//update campground
module.exports.updateCamp = catchError(async (req,res,next) => {
    const {id} = req.params
     const campground = await Campground.findByIdAndUpdate(id, {...req.body});
     const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
     campground.images.push(...imgs);
     await campground.save();
     if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    res.redirect(`/campgrounds/${campground._id}`)
})

//delete campground
module.exports.deleteCamp = catchError(async (req,res,next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})