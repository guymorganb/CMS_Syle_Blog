const router = require('express').Router();
const Session = require('../../models/sessions');
const fetch = require('node-fetch');
const fetchPostData = require('../../public/js/allUserPosts')
const chalk = require('chalk');

// this checks if the session is valid and removes any invalid session tokens
// it also fixes the session if the server somehow dies
async function checkSession(req, res, next){
  const sessionToken = req.cookies.session_token;
  if (!sessionToken) {
    // There's no session token in the user's cookies. They are not logged in.
    next();
    return;
  }
  try {
    // Retrieve the session using the token
    const session = await Session.findOne({
      where: {
        session_token: sessionToken
      }
    });
    
    if (!session) {
      // There's no session matching the user's token in the database. They are not logged in.
      await res.clearCookie('session_token'); // Clear the invalid token
      console.log("Session cleared")
      next();
      return;
    }
    // The session token is valid. reset session values as a backup in event of server disruption
    req.session.save(() => {
      req.session.user_id = session.user_id;
      req.session.logged_in = true;
    });
    next();
    console.log(chalk.blue("Session is valid, browser and Database match: "), chalk.green(req.cookies.session_token), "|", chalk.blue("Session user_id: "), chalk.green(req.session.user_id))
  } catch (err) {
    console.error('Error validating session token: ', err);
    next(err);
  }
}

// function to randomize the background image but still call the database
router.get('/',checkSession, (req, res) => {
    let imageUrl;
    fetch('https://source.unsplash.com/random')
        .then(response => {
            imageUrl = response.url;
        })
        .catch(error => {
            console.log(error);
            imageUrl = "/img/banner-bk.jpg";
        })
        .finally(() => {
            fetchPostData()
                .then(postDataList => {
                    if(req.cookies.session_token){
                        res.status(200).render('homepage', { activeSession: true, postDataList, imageUrl });
                        return;
                    }
                    res.status(200).render('homepage', { inActiveSession: true, postDataList, imageUrl });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Server Error');
                });
        });
});

module.exports = router;
