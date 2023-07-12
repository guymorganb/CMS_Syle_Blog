/**
 * Redirect incoming traffic to proper routes
 */
// Import the Express Router module
const router = require('express').Router();
// Import the routes for comments, new posts, and users
const commentRoutes = require('./comment_routes');
const newPostRoutes = require('./newPost_routes');
const userRoutes = require('./user_routes');
// Mount the routes under the path
router.use('/comments', commentRoutes);
router.use('/newPost', newPostRoutes);
router.use('/user', userRoutes);

module.exports = router;