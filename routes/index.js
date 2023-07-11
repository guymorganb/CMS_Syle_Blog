/**
 * Express router
 */
const router = require('express').Router();
const Routes = require('./api');

router.use('./api', Routes)

router.use((req,res) =>{
    res.send("Missed the router")
})

 module.exports = router;