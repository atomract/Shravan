const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const Image = require('../../models/Images/Image')
const mongoose = require('mongoose')
const Product = require('../../models/Product/Product')

let upload = multer({
    dest: `${__dirname}/../../uploads`
})

/*
    @route   GET api/product/test
    @desc    testing
    @access  Public
*/
router.get('/test', (req, res) => {
    res.json({
        msg: 'Route tested api/product/test'
    })
})


/*
    @route   GET api/product/addproduct
    @desc    Add Product
    @access  idk
*/
const addProductValidation = require('../../validation/addProductValidation')
router.post('/addproduct', upload.single('image'), (req, res) => {

    //Validation
    // const {
    //     errors,
    //     isValid
    // } = addProductValidation(req.body);

    // if (!isValid) {
    //     return res.status(400).json(errors)
    // }

    //Main Content
    console.log("REQ FILE >> ",req.file)
    console.log("REQ BODY >> ",req.body)
    const img = fs.readFileSync(req.file.path);
    const encimg = img.toString('base64')


    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        bidders: [],
        owner: req.user.id,
        basePrice: req.body.price,
        available: req.body.available,
        typeOfProduct: req.body.typeOfProduct,
        unit: req.body.unit
    })

    const image = new Image({
        image: new Buffer.from(encimg, 'base64'),
        contentType: req.file.mimetype
    })


    newProduct.save()
        .then(product => {
            console.log('ADDED PRODUCT ', product)
            image.save().then(img => {
                console.log("SAVED IMAGE ",img)
                product.imageId = img.id
                product
                    .save()
                    .then(savedProduct => {
                        console.log("SAVED PRODUCT ", savedProduct)
                        res.json(savedProduct)
                    })
                    .catch(err => {
                        res.json(err)
                    })
            })

        })
        .catch(err => {
            console.log("ERRRORRRRRRRRRR", err)
            res.json(err)
        })


 

   
})


/*
    @route   GET api/product/viewproduct/:id
    @desc    To retrieve details of a product
    @access  idk
*/
router.get('/viewproduct/:id', (req, res) => {

    Product.findOne({
            _id: req.params.id
        }).populate('images', 'users')
        .then(product => {
            if (!product) {
               return res
                    .status(400)
                    .json({
                        err: 'No product found'
                    })
            }

            res.json(product)

        })
        .catch(err => {
            res.status(400).json(err)
        });
});


/*
    @route   GET api/product/viewproducts
    @desc    To retrieve all details of all products
    @access  idk
*/
router.get('/viewproducts/', (req, res) => {
    Product.find({}).populate('images', 'users')
        .then(product => {
            if (!product) {
                res
                    .status(400)
                    .json({
                        err: 'No product found'
                    })
            }

            res.json(product)

        })
        .catch(err => {
            res.status(400).json(err)
        });
});


/*
    @route   GET api/product/image/:id
    @desc    To retrieve image from id of photo
    @access  idk
*/
// temp photo id : 5e252bd7e4eaa9478c019f02
router.get('/image/:id', (req, res) => {
    var filename = req.params.id;

    Image.findOne({
        '_id': mongoose.Types.ObjectId(filename)
    }, (err, result) => {

        if (err) return console.log(err)

        console.log(result)

        res.contentType(result.contentType);
        res.send(new Buffer.from(result.image.buffer, 'base64'))

    })
})


module.exports = router