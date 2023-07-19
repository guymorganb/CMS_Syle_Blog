/**
 * Routes for contact page
 */
const router = require('express').Router();
const Session = require('../../models/sessions');

// auth user
//its probably best to use a dedicated middleware for authorization like passport.js
// Middleware to check if user is authenticated
async function checkAuth(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
   
    if (!sessionToken) {
        res.redirect('/signup')
        return
    }
    // Search for the users session in the database by their sessionToken
    const userSession = await Session.findOne({ where: { session_token: sessionToken } }); 
    try {
        if (!userSession) {
            throw new Error('Session not found'); // throws an error if no session found
        }

        const rightNow = new Date();
        const sessionExpiration = new Date(userSession.expires_at);

        if (rightNow < sessionExpiration) {
            next(); // Session is valid, continue to the requested route
        } else {
            // Session is not valid, redirect the user to the signup page
            res.redirect('/signup');
        }
    } catch(err) {
        console.error('error: '+ err); // log the error
        res.redirect('/signup');
    }
}
// '/contact' endpoint
router.get('/',checkAuth,(req, res) => {
    imageUrl = "/img/contact-bk.jpg";
    try{
        res.status(200).render('contact', { isContactTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
module.exports = router;