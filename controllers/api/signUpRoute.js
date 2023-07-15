const router = require('express').Router();
const User = require('../../models/users');
const Session = require('../../models/sessions')
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
    if(req.body){
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
    } else{
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
        console.log("req.body ", req.body)
        // check if password is valid format and userName isnt taken then and create a new user
        const userName = await User.findOne({ where: { username: req.body.username } });
        // check to see if chosen username exists
        if (userName) {
            res.status(409).json({ message: 'Username is not available.' });
            return;
        }
        //Create a new user
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
        console.log('userData: ', userData)
        // search for the newly created user
        const newUserData = await User.findOne({ where: { email: userData.email } });

        if (!newUserData) {
            console.error({ message: 'User was not found' });
            res.status(404).json({ message: 'User was not found' });
            return;
        }

        // ----------------------go over everything below make sure it makes sense 
        // and aligns with the session model
        
        // Create a new session for the user
        let expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);  // Set session to expire in 1 hour
        
        const newSession = await Session.create({
            user_id: newUserData.id,
            session_token: req.session.id,  // Assuming you're using session IDs
            expires_at: expiresAt,
            active: true,
            minutes_active: 0,  // You can update this value as needed
        });

        // sets the session as active in the browser and saves it in the browser
        req.session.user_id = newUserData.id;
        req.session.active = true;
        await req.session.save();


        // set the users status to active in the database
        const userSession = await Session.findOne({ where: { user_id: newUserData.id } });

        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }
        console.log("session info",newSession)
        console.log('Success');
        res.status(201).json({ message: 'Profile created!' });
    } catch (err) {
        console.error({ message: 'Error in post route: ', Error: err });
        res.status(500).send('Server Error');
    }
});
module.exports = router;