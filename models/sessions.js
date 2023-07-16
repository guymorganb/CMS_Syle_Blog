/**
 * Session Model - stores a user session in the tech_blog database.
 *
 * @module models/session
 */
const sequelize = require('../config/dbconnection.js');
const { Model, DataTypes, Op } = require('sequelize');

class Session extends Model{

  static async updateHeartbeat(sessionToken) {
    try{
      const session = await this.findOne({where:{session_token: sessionToken}})
        if (session) {
          session.changed('updated_at', true);
          session.minutes_active += 5;
          await session.save();
          console.log('HeartBeat')
      }
    }catch (err) {
      console.error('Error in session model updateHeartbeat: ', err);
    }
  }
  static async clearExpiredSessions(cutoff) {
    try{
      this.destroy({ 
        where: { 
          updated_at: { 
            [Op.lt]: cutoff // [Op.lt] stands for "less than" (the < operator in SQL). This condition translates to: "where expires_at is less than now"
          // if updated_at is less than rightNow - 5 minutes, delete the session.
          } 
        } 
      });
      console.log("clearExpiredSessions: Expired sessions removed");
    }catch(err){
      console.error('Error in session model clearExpiredSessions: ', err);
    }
  }

  static async removeExpiredSessions() {
    try {
      const now = new Date();
      await this.destroy({
        where: {
          expires_at: {
            [Op.lt]: now // [Op.lt] stands for "less than" (the < operator in SQL). This condition translates to: "where expires_at is less than now"
          },
           active: false // sessions that are not active
        }
      });
      console.log("removeExpiredSessions: Expired sessions removed");
    } catch(err) {
      console.error("Error removing expired sessions: ", err);
    }
  }
}

Session.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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