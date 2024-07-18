const express=require('express');
const router=express.Router();
const AsyncError=require('../utils/AsyncError')
const AppError=require('../utils/AppError')
const {estateSchema}=require('../utils/schemaVerify')
const Estate=require('../models/estate')
const {Logged}=require('../utils/logged')

const validateEstate = (req, res, next) => {
    const { error } = estateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}

router.get('/', AsyncError(async (req, res) => {
    const estates = await Estate.find({});
    // console.log(estates)
    res.render('estates/index', { estates });
}));
router.get('/new', Logged, AsyncError((req, res) => {
    res.render('estates/new');
}))

router.post('/', Logged, validateEstate, AsyncError(async (req, res) => {
    const estate = new Estate(req.body.estate);
    await estate.save();
    res.redirect(`/estates/${estate._id}`)
}))

router.get('/:id', AsyncError(async (req, res,) => {
    const estate = await Estate.findById(req.params.id)
    res.render('estates/show', { estate });
}));

router.get('/:id/edit', Logged, AsyncError(async (req, res) => {
    const estate = await Estate.findById(req.params.id)
    res.render('estates/edit', { estate });
}))

router.put('/:id', Logged, validateEstate, AsyncError(async (req, res) => {
    const { id } = req.params;
    const estate = await Estate.findByIdAndUpdate(id, { ...req.body.estate });
    res.redirect(`/estates/${estate._id}`)
}));

router.delete('/:id', Logged,  AsyncError(async (req, res) => {
    const { id } = req.params;
    await Estate.findByIdAndDelete(id);
    res.redirect('/estates');
}))
module.exports = router;