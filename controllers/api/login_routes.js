const router = require('express').Router();
const User = require('../../models/users');
const Session = require('../../models/sessions')
const uuid = require('uuid');
// '/login' endpoint
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
            imageUrl = "/img/tech2.png";
        })
        .finally(() => {
            try{
                res.status(200).render('login', { isLoginTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
});
// '/login' endpoint
router.post('/', async (req,res)=>{
    try{
        // find the user by email
        const userData = await User.findOne({where:{email: req.body.email}})
        if(!userData){
            res.status(404).json({message: "User not found!"})
            return;
        }
     // uses the ckeckPassword function inside the USER model, returns true if it matches
     const validPassword = await userData.checkPassword(req.body.password);
     if (!validPassword) {
       res.status(400).json({message: "Incorrect email or password"});
       return;
     }
      let expiresAt = new Date();
     // Set the initial expiration time of the session for 30 minutes
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); 
      const sessionToken = uuid.v4();
      // setting the seeeion in the database
      const newSession = await Session.create({
          user_id: userData.id,
          session_token: sessionToken,  // session IDs
          expires_at: expiresAt,
          active: true,
      });

     // sets the express-session as active
     req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
    });
      
     // set the users status to active in the database
     const userSession = await Session.findOne({where: { user_id: userData.id }})
     if (userSession) {
        userSession.active = true;
        await userSession.save();
    }
    // send back the newSession info to user
     res.json({ newSession });
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
        return res.status(500).json({message: 'Error session interrupted unexpectedly: Session will refresh in 30 min'})
    }
})
module.exports = router;