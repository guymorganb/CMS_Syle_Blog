const router = require('express').Router();
const User = require('../../models/users');
const Session = require('../../models/sessions')

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
     // sets the session as active
     req.session.user_id = userData.id;
     req.session.active = true;
     await req.session.save()

     // set the users status to active in the database
     const userSession = await Session.findOne({where: { user_id: userData.id }})
     if (userSession) {
        userSession.active = true;
        await userSession.save();
    }
     res.status(200).json({ message: "Success!" });

    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
    }
})
module.exports = router;