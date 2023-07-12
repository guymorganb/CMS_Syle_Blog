/**
 * Express router
 */
const router = require('express').Router();
const Routes = require('./api/index');
const home = require('./api/homeRoutes')

router.use('/', homeRoutes);

router.use('./api', Routes)

router.use((req,res) =>{
    res.send("❗❗ We missed the router ❗❗")
})

 module.exports = router;