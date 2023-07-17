const router = require('express').Router();
const Session = require('../../models/sessions');
const User = require('../../models/users') 
const Post = require('../../models/posts')
const Comment = require('../../models/comments')
const fetch = require('node-fetch');
const { v5: uuidv5 } = require('uuid');
require('dotenv').config();
//its probably best to use a dedicated middleware for authorization like passport.js
// Middleware to check if user is authenticated
async function checkAuth(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
   
    if (!sessionToken) {
        res.redirect('/signup')
        return
    }
    // Search for the users session in the database by their cookieUserId saved by express-sessions
    const userSession = await Session.findOne({ where: { session_token: sessionToken } }); 
    try {
        if (!userSession) {
            throw new Error('Session not found'); // throws an error if no session found
        }

        const rightNow = new Date();
        const sessionExpiration = new Date(userSession.expires_at);
        if (rightNow < sessionExpiration) {
            next(); // Session is valid, continue to the requested route
        } else {
            // Session is not valid, redirect the user to the signup page
            res.redirect('/signup');
        }
    } catch(err) {
        console.error('error: '+ err); // log the error
        res.redirect('/signup');
    }
}
// '/dashboard' endpoint
router.get('/',checkAuth ,(req, res) => {
    imageUrl = "/img/tech4.png";
 // check if the user session token is already valid
    // if not valid then give them the login screen
    try{
        res.status(200).render('dashboard', { isDashboardTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});

// '/dashboard/newpost' endpoint
router.get('/newpost', (req, res) => {
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
                res.status(200).render('dashboard', { isNewPostTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
});

// Utility function to fetch posts, comments, and users
async function fetchPostData(userId) {
    return Promise.all([
        // This fetches a single user, not all users
        Post.findAll({where:{user_id: userId}}), 
        Comment.findAll({where:{user_id: userId}}), 
        User.findOne({where:{id: userId}}),
    ])
    // comment is not defined fix this
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
        })
        .catch((err) => {
            console.error("Error fetching post data: ", err);
            throw err; // or handle the error in some other way
        });
}
// function to randomize the background image but still call the database
// '/dashboard/viewpost' endpoint
router.get('/viewposts', checkAuth, async (req, res) => {
    let cookieUserId = req.session.user_id;
    let imageUrl

    if(!cookieUserId){
        return res.status(401).json({ error: "No user id found in session"})
    }

    try{
        let response = await fetch('https://source.unsplash.com/random');
        imageUrl = response.url;
    }catch(err){
        console.error(err);
        imageUrl = "/img/tech4.png";
    }
    try {
        let postDataList = await fetchPostData(cookieUserId);
        res.status(200).render('dashboard', { isViewPostTemplate: true, imageUrl, postDataList });
    } catch(error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// '/dashboard/viewposts/createnew' endpoint
router.post('/viewposts/createnew', checkAuth, async (req, res) => {
    const {title, body} = req.body;
    let cookieUserId = req.session.user_id;

    if(!cookieUserId){
        console.error({error: "No user id found in session"})
        res.status(401).redirect('/viewposts');
        return;
    }
    let uuid = uuidv5(title, process.env.NAMESPACE);
    let newBlogPost = {
        id: uuid,
        title: title,
        body: body,
        user_id: cookieUserId
    }

    try{
        await Post.create(newBlogPost)
        res.redirect('/dashboard/viewposts');
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server Error', error: err})
    }
});

module.exports = router;