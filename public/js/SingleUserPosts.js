/**
 * .js to get an authorized users posts
 */
const User = require('../../models/users') 
const Post = require('../../models/posts')
const Comment = require('../../models/comments')

async function getUserPostData(userId) {
    return Promise.all([
        Post.findAll({where:{user_id: userId}}), 
        Comment.findAll({where:{user_id: userId}}), 
        User.findOne({where:{id: userId}})
    ])
        .then(([posts, comments, user]) => {
            // If there are no posts and comments, return a custom message
            if (posts.length === 0 && comments.length === 0) {
                return 'No posts or comments found for this user';
            }

            comments = comments.map(comment => comment.dataValues);
            posts = posts.map(post => post.dataValues);
            user = user.dataValues;

            let postDataList = [];

            for (let i = 0; i < posts.length; i++) {
                let postUser = user;
                let postComments = comments.filter(comment => comment.post_id === posts[i].id);

                let commentsData = postComments.map(comment => {
                    let commentUser = user;

                    return {
                        id: comment.id, // This is the comment's ID
                        postId: posts[i].id, // This is the ID of the post the comment belongs to
                        content: comment.content,
                        created: new Date(comment.createdAt).toLocaleString(),
                        username: commentUser ? commentUser.username : null
                    };
                });

                let postData = {
                    id: posts[i].id,
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
            throw err;
        });
}
module.exports = getUserPostData;