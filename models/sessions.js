/**
 * Session Model - stores a user session in the tech_blog database.
 *
 * @module models/session
 */
const sequelize = require('../config/dbconnection.js');
const{ Model, DataTypes} = require('sequelize');

class Session extends Model{}
Session.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    minutes_active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'sessions',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    hooks: {
      beforeUpdate: async (session, options) => {
        const previous = session._previousDataValues;
        const current = session.dataValues;

        if (previous.active && !current.active) {
          // If active changed from true to false, calculate duration
          const minutes_active = Math.floor((new Date() - previous.updatedAt) / (1000 * 60));
          // Accumulate total minutes active
          session.minutes_active += minutes_active;
        }
      },
    },
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
        name: "session_token",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "session_token" },
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
  module.exports = Session;