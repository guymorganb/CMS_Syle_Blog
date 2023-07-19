const router = require('express').Router();
const Session = require('../../models/sessions');
const User = require('../../models/users') 
const Post = require('../../models/posts')
const Comment = require('../../models/comments')
const getUserPostData = require('../../public/js/SingleUserPosts')
const fetchPostData = require('../../public/js/allUserPosts')
const fetch = require('node-fetch');
const { v5: uuidv5 } = require('uuid');
const chalk = require('chalk');
require('dotenv').config();
// check if theres an active user session before attempting to update or change data
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
      req.session.user_id = session.user_id
      req.session.active = true;
      await req.session.save(),
      next();
      console.log(chalk.blue("Session is valid, browser and Database match: "), chalk.green(req.cookies.session_token), "|", chalk.blue("Session user_id: "), chalk.green(req.session.user_id))
    } catch (err) {
      console.error('Error validating session token: ', err);
      next(err);
    }
}

// '/editpost' route
router.post('/', checkSession, async (req, res) => {
  try{
    let rightNow = new Date()
    let postId = req.body.postId
    let commentData = req.body.commentData
    let session_token = req.cookies.session_token
    const userId = await Session.findOne({
      where: {
        session_token: session_token,
      }
    })
    if(userId){
      try{
        await Comment.create({
          post_id : postId,
          user_id : userId.user_id,
          content : commentData,
          createdAt : rightNow
        });
        console.log("the users id that will go to the comments user_id feild ",userId.user_id)
        console.log("id of original post, that get put onto the comment post_id: ", postId)
        console.log("commentData: ", commentData)
        console.log("this sessions token that you use to get the users id", session_token)
        return res.status(200).json({message: 'you hit the return statment'})
      }catch(err){
        return res.status(500).json({message: "Error creating comment", Error: err})
       
      }
    }
    }catch(err){
      res.status(500).json({message: "Server Error: ", Error: err})
    }
})

module.exports = router;