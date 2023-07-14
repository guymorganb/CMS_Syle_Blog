/**
 * Associations - Establishes the associations between the Comment, Post, and User models.
 * This allows for easy retrieval of associated data in the tech_blog application.
 *
 * @module models/Associations
 */
const Comment = require("./comments");
const Post = require("./posts");
const User = require("./users");
const Session = require('./sessions')

Comment.hasOne(Post, { as: "post", foreignKey: "post_id"});

Post.hasMany(Comment, { as: "comments", foreignKey: "post_id"});

Comment.belongsTo(User, { as: "user", foreignKey: "user_id"});

User.hasMany(Comment, { as: "comments", foreignKey: "user_id"});

Post.belongsTo(User, { as: "user", foreignKey: "user_id"});

User.hasMany(Post, { as: "posts", foreignKey: "user_id"});

Session.belongsTo(User, { as: "user", foreignKey: "user_id"});

User.hasOne(Session, { as: "sessions", foreignKey: "user_id"});

module.exports = {
  Comment,
  Post,
  User,
  Session,
};

