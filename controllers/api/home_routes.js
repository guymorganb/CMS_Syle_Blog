const router = require('express').Router();
const Comment  = require('../../models/comments')
const Post = require('../../models/posts')
const User = require('../../models/users')
const fetch = require('node-fetch');

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
router.get('/', (req, res) => {
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
                    res.status(200).render('homepage', { postDataList, imageUrl });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Server Error');
                });
        });
});

module.exports = router;
