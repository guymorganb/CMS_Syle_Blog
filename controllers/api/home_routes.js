const router = require('express').Router();
const Comment  = require('../../models/comments')
const Post = require('../../models/posts')
const User = require('../../models/users')
const Session = require('../../models/sessions');
const fetch = require('node-fetch');

// Utility function to fetch posts, comments, and users
async function fetchPostData() {
    return Promise.all([Post.findAll(), Comment.findAll(), User.findAll()])
        .then(([posts, comments, users]) => {
            comments = comments.map(comment => comment.dataValues);
            posts = posts.map(post => post.dataValues)
            users = users.map(user => user.dataValues)

            let postDataList = [];

            for (let i = 0; i < posts.length; i++) {
                let postUser = users.find(user => user.id === posts[i].user_id);
                let postComments = comments.filter(comment => comment.post_id === posts[i].id);

                let commentsData = postComments.map(comment => {
                    let commentUser = users.find(user => user.id === comment.user_id);

                    return {
                        content: comment.content,
                        created: new Date(comment.createdAt).toLocaleString(),
                        username: commentUser ? commentUser.username : null
                    };
                });

                let postData = {
                    userPost: {
                        title: posts[i].title,
                        content: posts[i].body,
                        created: new Date(posts[i].createdAt).toLocaleString(),
                        username: postUser ? postUser.username : null
                    },
                    comments: commentsData
                };
                postDataList.push(postData);
            }

            return postDataList;
        });
}
// this checks if the session is valid and removes any invalid session tokens
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
  
      // The session token is valid. Proceed with the request.
      next();
      console.log("Session is valid, browser and Database match")
    } catch (err) {
      console.error('Error validating session token: ', err);
      next(err);
    }
}


// function to randomize the background image but still call the database
router.get('/',checkSession, (req, res) => {
    let imageUrl;
    setTimeout(() => {console.log('...........', req.cookies.session_token)}, 500);
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
