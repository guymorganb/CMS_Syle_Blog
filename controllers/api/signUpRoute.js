const router = require('express').Router();
const User = require('../../models/users');
const Session = require('../../models/sessions')

// '/signup endpoint'
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
// /signup/create endpoint
// validate their email is good and not a duplicate
router.post('/create', async (req,res)=>{
    try{
        const userData = await User.findOne({where:{email: req.body.email}})
        if(userData){
            res.status(409).json({message: "Conflit, email already exists."})
            return;
        }
        res.status(200).json("No duplicate emails found")
    }catch(err){
            console.error({message: "Error in post route: ", Error: err})
        }
    })
// /signup/create/newuser endpoint
// user chooses a username and password which is validated
router.post('/create/newuser', async (res,req) =>{
    try{
        // check if password is valid format and userName isnt taken then and create a new user
        const UserName = await User.findOne({where: {username: req.body.username}})
        // check to see if chosen username exists
        if(UserName){
            res.status(409).json({message: 'Username is not avaliable.'})
            return;
        }




     // set the users status to active in the database
        const userSession = await Session.findOne({where: { user_id: userData.id }})
        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }
        res.status(200).json({ message: "Success!" });




        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
          res.status(400).json({message: "Incorrect email or password"});
          return;
        }
        // sets the session as active
        req.session.user_id = userData.id;
        req.session.active = true;
        await req.session.save()
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
    }

})
     
 



    
module.exports = router;