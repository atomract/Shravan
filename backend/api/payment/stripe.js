const router = require('express').Router()
const StripeApiKey = process.env.STRIPE_API_KEY || 'sk_test_GMJZseezG4HQp6HUQVdHIBIo00do7b8Pac';
const stripe = require('stripe')(StripeApiKey);


/*
    @route   POST api/payment/:amt
    @desc    To Charge for the given ammount
    @access  Private   
*/

router.get('/:amt',(req ,res) => {
    stripe.charges.create({
        amount: req.params.amt,
        source: req.body.stripeTokenId,
        currency: 'inr'
      }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })
      }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
      })
});


//Alterantive code

// (async () => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1099,
//     currency: 'inr',
//   });
// })();


module.exports = router