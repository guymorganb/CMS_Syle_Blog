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
    let cookieSessionId = req.session.id; // this is the saved session token-id in the browser
    let cookieExpirationTime = req.session.cookie._expires      // expiration date of the cookie
    let isActive = req.session.active // active status of the user

    let expiresAt = userSession.expires_at
    let cookieUserId =  req.session.user_id   // this is the users id that is saved in the session
    // search for the users session in the database by their cookieUserId saved by express-sessions
    const userSession = await Session.findOne({ where: { user_id: cookieUserId } }); 

    console.log("expires: ",expiresAt)
   
    const rightNow = new Date();
    const sessionExpiration = new Date(userSession.expires_at);
    console.log("session valid? : ",rightNow <  sessionExpiration, sessionExpiration-rightNow)
    if (rightNow < sessionExpiration) {
        next(); // Session is valid, continue to the requested route
    } else {
        // Session is not valid, redirect the user to the signup page
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
    let imageUrl;
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


                res.status(200).render('dashboard', { isNewPostTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
});
module.exports = router;