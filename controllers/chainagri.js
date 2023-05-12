const Chainagri = require("../models/chainagri");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const chainagri = await Chainagri.find({});
  res.render("chainagri/index", { chainagri });
};

module.exports.renderNewForm = (req, res) => {
    res.render('chainagri/new');
}

module.exports.createChainagri = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.chainagri.location,
        limit: 1
    }).send()
    const chainagri = new Chainagri(req.body.chainagri);
    chainagri.geometry = geoData.body.features[0].geometry;
    chainagri.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    chainagri.author = req.user._id;
    await chainagri.save();
    console.log(chainagri)
    req.flash('success', 'Successfully made a new Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}

module.exports.showChainagri = async (req, res,) => {
    const chainagri = await Chainagri.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/show', { chainagri });
}

module.exports.renderEditForm = async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id)
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/edit', { chainagri });
}

module.exports.updateChainagri = async (req, res) => {
    const { id } = req.params;
    const chainagri = await Chainagri.findByIdAndUpdate(id, { ...req.body.chainagri });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    chainagri.image.push(...imgs);
    await chainagri.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await chainagri.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}

module.exports.deleteChainagri = async (req, res) => {
    const { id } = req.params;
    await Chainagri.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Tea Stall')
    res.redirect('/chainagri');
}