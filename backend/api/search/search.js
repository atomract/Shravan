const router = require('express').Router()
const mongoose = require('mongoose')
const Product = require('../../models/Product/Product')

/*
    @route   GET api/search/test
    @desc    testing
    @access  Public
*/
router.get('/test', (req, res) => {
    res.json({
        msg: 'Route tested api/search/test'
    })
});

/*
    @route   GET api/search/:query
    @desc    To get the result for the query
    @access  Public
*/
router.get('/:query', (req, res) => {
    Product.find({
        $text: { $search: req.params.query },
      })
        .then((products) => {
            res.json(products)
        })
        .catch(err => {
            res.status(400).json(err)
        });
});

module.exports = router;