/**
 * Post Model - Represents a post in the tech_blog database.
 *
 * @module models/Post
 */
const sequelize = require('../config/dbconnection.js');
const { Model, DataTypes } = require('sequelize');

class Post extends Model{}
Post.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'posts',
      freezeTableName: true,
      modelName: 'post',
      timestamps: true,
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
    })
module.exports = Post;
