/**
 * Express router
 */
const router = require('express').Router();
//const commentRoutes = require('./comment_routes');
//const newPostRoutes = require('./newPost_routes');
//const userRoutes = require('./user_routes');
//const login = require('./loginRoute')
//const signUp= require('./signUpRoute')
const homeRoutes = require('./api/homeRoutes')
// gets all user comments and posts
router.use('/', homeRoutes);


// for loging in directly

//router.use('/login', login)
// for signing up

//router.use('/signUp', signUp)

//router.use('./api', Routes)

router.use((req,res) =>{
    res.send("❗❗ We missed the router ❗❗")
})

 module.exports = router;