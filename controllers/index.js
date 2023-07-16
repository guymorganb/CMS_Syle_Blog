/**
 * Express router
 */
const router = require('express').Router();
//const commentRoutes = require('./comment_routes');
const dashboard = require('./api/dashboard_routes');
const contact = require('./api/contact_routes');
const login = require('./api/login_routes')
const signUp= require('./api/signUp_routes')
const home = require('./api/home_routes')
const signout = require('./api/signout_routes')
const heartbeat = require('./api/heartbeat')
// gets all user comments and posts
router.use('/', home);
// for loging in directly
router.use('/login', login)
// for the dashboard
router.use('/dashboard', dashboard)
// for signing up
router.use('/signup', signUp)
// for signing out
router.use('/signout', signout)
//for contact page
router.use('/contact', contact)
// for heartbeat ping
router.use('/heartbeat', heartbeat)


router.use((req,res) =>{
    res.send("❗❗ We missed the router ❗❗")
})

module.exports = router;