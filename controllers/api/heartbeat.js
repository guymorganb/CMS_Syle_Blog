/**
 * route for handling pings coming from user activity from the view post & new post are loaded in the browser
 */
const router = require('express').Router();
const Session = require('../../models/sessions')




router.post('/heartbeat', (req, res) => {
  console.log('inside heartbeat:req.body ', req.body)
  return
  const sessionToken = req.cookies.session_token;

  console.log('inside heartbeat: ', req.cookies.session_token)
  console.log('inside heartbeat:req.body ', req.body)
  // heartbeat route to update the session model 'updated_at'
  Session.updateHeartbeat(sessionToken)
    .then(() => res.sendStatus(200))
    .catch(error => {
      console.error('Error:', error);
      res.sendStatus(500);
    });
  });



module.exports = router;