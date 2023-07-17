/**
 * Session Model - stores a user session in the tech_blog database.
 *
 * @module models/session
 */
const sequelize = require('../config/dbconnection.js');
const { Model, DataTypes, Op } = require('sequelize');

class Session extends Model{
  // user activity triggers a ping and sends it to the session model altering the updated at time
  static async updatePing(sessionToken) {
    try{
      const session = await this.findOne({where:{session_token: sessionToken}})
        if (session) {
          const now = new Date();
          // this should change the updated at status to a more current time 'changed' flag is used to make sure the timestamp is updated
          session.updated_at = now;
          session.changed('updated_at', true);
          await session.save();
        }
    }catch (err) {
      console.error('Error in session model ping: ', err);
    }
  }
  // static method to update the session status for login/logout
  static async updateActiveStatus(boolean, sessionToken) {
    try {
      if(typeof boolean !== 'boolean') {
        throw new TypeError('Type must be boolean');
      }
      const session = await this.findOne({where:{session_token: sessionToken}});
      if (session) {
        if(boolean !== session.active){
          session.active = boolean;
          await session.save();
          if(session.active == false){
            this.calcMinutes(sessionToken)
          }else{
            this.updatePing(sessionToken)
          }
        }else{
          throw new TypeError('The session active status matches your input');
        }
      }else{
        throw new Error('Session not found for given token');
      }
    } catch(err) {
      console.error('Error in session model updateActiveStatus: ', err);
    }
  }
  // calculate the minutes the user is active
  static async calcMinutes(sessionToken) {
    try{
      const session = await this.findOne({where:{session_token: sessionToken}})
      if (session) {
        const now = new Date();
        if (session.active) {
          // If the session is active, calculate the difference in minutes
          // between the last activity and now, and add it to the minutes_active
          const minActive = Math.floor((now - session.last_activity_time) / 60000);
          session.minutes_active += minActive;
        }
        // Always update the last_activity_time field
        session.updated_at = now;
        session.changed('updated_at', true);
        await session.save();
      }
    }catch (err) {
      console.error('Error in session model ping: ', err);
    }
  }
  // static method
  static async findExpiredSessions() {
    try {
      const now = new Date();
      const expiredSessions = await this.findAll({
        where: {
          expires_at: {
            [Op.lt]: now  // find where 'expires_at' is less than the current time
          },
          active: true  // and the session is still marked as active
        }
      });

      for (const session of expiredSessions) {
        session.active = false;  // mark session as inactive
        await session.save();  // save the updated session back to the database
        await this.calcMinutes(session.session_token)
        await this.updatePing(session.session_token)
      }
      console.log("findExpiredSessions: Found and deactivated expired sessions.");
    } catch (err) {
      console.error("Error in finding expired sessions: ", err);
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
    }catch(err){
      console.error('Error in session model clearExpiredSessions: ', err);
    }
  }
// this is an auxuilary function ill keep
  static async removeAll() {
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