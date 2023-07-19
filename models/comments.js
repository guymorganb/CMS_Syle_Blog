/**
 * Comment Model - Represents a comment in the tech_blog database.
 *
 * @module models/Comment
 */
const sequelize = require('../config/connection.js')
const{ Model, DataTypes} = require('sequelize');
class Comment extends Model{}
Comment.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    content: {
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
    },
    post_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'comments',
    freezeTableName: true,
    modelName: 'comment',
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
      {
        name: "post_id",
        using: "BTREE",
        fields: [
          { name: "post_id" },
        ]
      },
    ]
  });
  module.exports = Comment;
