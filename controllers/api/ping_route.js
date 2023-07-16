/**
 * route for handling pings coming from user activity from the view post & new post are loaded in the browser
 */
const router = require('express').Router();
const Session = require('../../models/sessions')



// '/ping' endpoint
router.post('/', (req, res) => {
  console.log('inside ping:req.body ', req.body)
  try{
    const sessionToken = req.cookies.session_token;
    if(!sessionToken){
      res.status(400)
      return;
    }
    console.log('inside ping route: ', req.cookies.session_token)
    console.log('inside ping route:req.body ', req.body)
    // ping route to update the session model 'updated_at'
    Session.updatePing(sessionToken)
      .then(() => res.sendStatus(200))
      .catch(error => {
        console.error('Error:', error);
        res.status(500).json({message: 'Server Error', Error: err})
      });
    
  }catch(err){
    res.status(500).json({message: 'Server Error', Error: err})
  }

  });



module.exports = router;