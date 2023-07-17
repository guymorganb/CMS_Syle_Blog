/**
 * Routes for signing out
 */
const router = require('express').Router();
const Session = require('../../models/sessions');
const User = require('../../models/users') 

// auth user
//its probably best to use a dedicated middleware for authorization like passport.js
// Middleware to check if user is authenticated
async function checkAuth(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
   
    if (!sessionToken) {
        res.redirect('/signup')
        return
    }
    // Search for the users session in the database by their cookieUserId saved by express-sessions
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

// '/signout' endpoint
router.get('/',checkAuth ,(req, res) => {
    imageUrl = "/img/contact-bk.jpg";
    try{
        res.status(200).render('signout', { isSignoutTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
// '/signout/confirm' endpoint
router.get('/confirm', (req, res) => {
    try{
        let sessionToken =  req.cookies.session_token
        Session.updateActiveStatus(false, sessionToken)
        Session.kill(sessionToken);
        // check if the user session token is already valid
        // if not valid then give them the login screen
        fetch('https://source.unsplash.com/random')
            .then(response => {
                imageUrl = response.url;
            })
        .catch(error => {
            console.log(error);
            imageUrl = "/img/tech2.png";
        })
        .finally(() => {
            try{
                // kill the user session and set their logged in status to falsy
                res.status(200).render('signout', { isConfirmSignOut: true, imageUrl })
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
    }catch(err){
        console.error('Error terminating session: ', err)
    }
});
module.exports = router;