/**
 * User Model - Represents a user in the tech_blog database.
 *
 * @module models/User
 */
const sequelize = require('../config/dbconnection.js');
const{ Model, DataTypes} = require('sequelize');

class User extends Model{}
User.init(
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      role: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'users',
      freezeTableName: true,
      modelName: 'user',
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
      ]
    });
module.exports = User;
