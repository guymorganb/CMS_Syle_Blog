const router = require('express').Router();
const Comment  = require('../../models/comments')
const Post = require('../../models/posts')
const User = require('../../models/users')
const fetch = require('node-fetch');
const Session = require('../../models/sessions')
// Utility function to fetch posts, comments, and users
function fetchPostData() {
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
// function to randomize the background image but still call the database
router.get('/', async (req, res) => {
    try {
        let imageUrl;
        let userSession = null;

        const response = await fetch('https://source.unsplash.com/random');
        imageUrl = response.url;

        if(req.cookies.session_token) {
            let sessionToken = req.cookies.session_token;
            userSession = await Session.findOne({ where: { session_token: sessionToken } });
        }

        const postDataList = await fetchPostData();
        const userAuth = userSession ? true : false;
        res.status(200).render('homepage', { isAuth: userAuth, postDataList, imageUrl });
    } 
    catch (error) {
        console.error(error);

        // Fallback image url if the fetch operation fails
        const imageUrl = "/img/banner-bk.jpg";

        // If session cookie exists, try to get the user session
        if (req.cookies.session_token) {
            let sessionToken = req.cookies.session_token;
            userSession = await Session.findOne({ where: { session_token: sessionToken } });
        }

        // Attempt to fetch the postData
        try {
            const postDataList = await fetchPostData();
            const userAuth = userSession ? true : false;
            res.status(200).render('homepage', { isAuth: userAuth, postDataList, imageUrl });
        } 
        catch (postDataError) {
            console.error(postDataError);
            res.status(500).send('Server Error');
        }
    }
});

module.exports = router;
