const router = require('express').Router()
const mongoose = require('mongoose')
const Product = require('../../models/Product/Product')

/*
    @route   GET api/bid/test
    @desc    testing
    @access  Public
*/
router.get('/test', (req, res) => {
    res.json({
        msg: 'Route tested api/bid/test'
    })
});

/*
    @route   GET api/product/test
    @desc    testing
    @access  Public
*/
router.post('/addbidder/:pid', (req, res) => {
    console.log("<< ADD BIDDER ROUTE >>", req.user)
    // if(! req.user) {
    //     res.status(400).json({
    //         err: 'User not logged in'
    //     })
    // }
    const userId = req.body.id
    const bidPrice =  req.body.bidPrice
    Product
        .findById(req.params.pid)
        .populate('users', 'images')
        .then(product => {
            // if(!product) {
            //     res
            //     .status(400)
            //     .json({
            //         err: 'Product not found'
            //     })
            // }

            console.log("FOUND PRODUCT >> ",product)


            product.bidders.unshift({userid: userId, bidPrice: bidPrice})
            product
                .save()
                .then(savedProduct => {
                    console.log("SAVED PRODUCT ",savedProduct)
                    res.json(savedProduct)
                })
                .catch(err => {
                    console.log("ERR 1 ",err)
                    res.status(400).json(err)
                })


        })
        .catch(err => {
            console.log("ERR 2 ",err)
            res.status(400).json(err)
        })
         



});

module.exports = router