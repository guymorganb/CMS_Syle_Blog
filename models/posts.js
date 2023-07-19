/**
 * Post Model - Represents a post in the tech_blog database.
 *
 * @module models/Post
 */
const sequelize = require('../config/connection.js');
const { Model, DataTypes } = require('sequelize');

class Post extends Model{}
Post.init({
    id: {
      autoIncrement: false,
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'posts',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
module.exports = Post;