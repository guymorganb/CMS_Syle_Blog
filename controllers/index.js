/**
 * Express router
 */
const router = require('express').Router();
//const commentRoutes = require('./comment_routes');
const dashboard = require('./api/dashboard_route');
//const userRoutes = require('./user_routes');
const login = require('./api/loginRoute')
const signUp= require('./api/signUpRoute')
const homeRoutes = require('./api/homeRoutes')


// gets all user comments and posts
router.use('/', homeRoutes);
// for loging in directly
router.use('/login', login)
// for the dashboard
router.use('/dashboard', dashboard)
// for signing up
router.use('/signup', signUp)
// for creating a new user

//router.use('./api', Routes)

router.use((req,res) =>{
    res.send("❗❗ We missed the router ❗❗")
})

 module.exports = router;