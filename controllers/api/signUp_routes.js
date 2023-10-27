const router = require('express').Router();
const User = require('../../models/users');
const Session = require('../../models/sessions')
const uuid = require('uuid');
let userData = {};
// '/signup' endpoint
router.get('/', (req, res) => {
    let imageUrl;
 // check if the user session token is already valid
    // if not valid then give them the login screen
    fetch('https://source.unsplash.com/random')
        .then(response => {
            imageUrl = response.url;
        })
        .catch(error => {
            console.log(error);
            imageUrl = "/img/tech4.png";
        })
        .finally(() => {
            try{
                res.status(200).render('signup', { isSignUpTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
});
// '/signup/create' endpoint
// validate their email is good and not a duplicate
router.post('/create', async (req,res)=>{
    let imageUrl;
    if(req.body) {
        userData = {
            first_name: req.body.fName,
            last_name: req.body.lName,
            username: "",
            email: req.body.email,
            password_hash: "",
            role: 'user',
            dob: req.body.dob,
            zip: parseInt(req.body.zip),
        }
    } else {
        res.status(400)
        return
    }
    try{
        const duplicateData = await User.findOne({where:{email: userData.email}})
        if(duplicateData){
            res.status(409).json({message: "Email already exists."})
            return;
        }    
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
                res.status(200).render('newUser', { isNewUserTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
    }
})
// '/signup/newuser' endpoint
router.get('/newuser', async (req,res) =>{
    let imageUrl;
    fetch('https://source.unsplash.com/random').then(response => {imageUrl = response.url})
    .catch(error => {
        console.error({message: 'Unsplash imageUrl is broken', Error: error}); 
        imageUrl = "/img/tech2.png";
    })
    .finally(()=>{
        try{
            res.status(200).render('newUser', { isNewUserTemplate: true, imageUrl });
        }catch(error){
            console.error({message: 'A server error occured', Error: error})
            res.status(500).send('Server Error')
        }
    })
})

// '/signup/newuser/credentials' endpoint
// user chooses a username and password which is validated
router.post('/newuser/credentials', async (req, res) => {
    try {
        const userName = await User.findOne({ where: { username: req.body.username } });

        if (userName) {
            res.status(409).json({ message: 'Username is not available.' });
            return;
        }
        userData = await User.create({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: req.body.username,
            email: userData.email,
            password_hash: req.body.password,
            role: 'user',
            dob: userData.dob,
            zip: userData.zip,
        });
        const newUserData = await User.findOne({ where: { email: userData.email } });
        if (!newUserData) {
            console.error({ message: 'User was not found' });
            res.status(404).json({ message: 'User was not found' });
            return;
        }
        const sessionToken = uuid.v4();
        let expiresAt = new Date();
        // Set the initial expiration time of the session for 30 minutes
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); 
        // setting the seeeion in the database
        const newSession = await Session.create({
            user_id: newUserData.id,
            session_token: sessionToken,  // session IDs
            expires_at: expiresAt,
            active: true,
            minutes_active: 0,  // update this value as needed
        });
        // sets the express-session as active and the user_id
        req.session.save(() => {
            req.session.user_id = newUserData.id;
            req.session.logged_in = true;
        });
        // set the users status to active in the database
        const userSession = await Session.findOne({ where: { session_token: sessionToken } });
        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }
        res.status(200).json({ newSession });
    } catch (err) {
        console.error({ message: 'Error in post route: ', Error: err });
        res.status(500).send('Server Error');
    }
});
module.exports = router;

// example of how to implement Re-Captcha

/**
 * Step 1: Include reCAPTCHA on the Front-end

Sign up for an API key pair for your site at the Google's reCAPTCHA website. Once you've got the keys, include the reCAPTCHA script in your front-end form:
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

Then, include this in your form:
<div class="g-recaptcha" data-sitekey="your-site-key"></div>
Upon successful completion of the reCAPTCHA, a new field g-recaptcha-response will be automatically added to your form when the form is submitted.
 */

/**
 * Step 2: Validate reCAPTCHA on the Server-side

In your Express.js route, use a library like axios to make an HTTP POST request to Google's reCAPTCHA API and verify the user's response. You can add this as a middleware function before creating the new user.

Here is an example of how you might do this:
const axios = require('axios');  // install this package if you haven't already

async function verifyCaptcha(req, res, next) {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = "your-secret-key";  // your reCAPTCHA secret key

    // make a request to the Google's reCAPTCHA API
    const result = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`, {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
    });
    // check the response from Google's reCAPTCHA API
    if (!result.data.success) {
        return res.status(400).json({message: "reCAPTCHA verification failed."});
    }
    // if everything is ok, proceed with the next middleware
    next();
}
router.post('/newuser', verifyCaptcha, async (req,res) => {
    // Your existing code
});

In this code, verifyCaptcha is a middleware function that gets the reCAPTCHA response from the form, sends a request to Google's reCAPTCHA API to validate the response, and checks the result. 
If the reCAPTCHA validation fails, it sends a 400 status code with an error message. Otherwise, it calls next() to proceed to the next middleware, which is your user creation route.

Please replace "your-secret-key" with your own secret key that you get from Google's reCAPTCHA site. Also, install the axios package with npm install axios if you haven't already installed it.
 */