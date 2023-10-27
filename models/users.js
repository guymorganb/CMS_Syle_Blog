/**
 * User Model - Represents a user in the tech_blog database.
 *
 * @module models/User
 */
const sequelize = require('../config/connection.js');
const{ Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt')

const hashPassword = async (newUserData) => {
  const newPassword = await bcrypt.hash(newUserData.password_hash, 10); // password_hash is the field you're storing the password in
  newUserData.password_hash = newPassword;
};

class User extends Model{
  // this function uses bcrypt to  validate a pasword with the saved hashed password
  async checkPassword(loginPw) {
    // console.log(`loginPw: ${loginPw}, this.password: ${this.password_hash}`);
    return bcrypt.compareSync(loginPw, this.password_hash);
  }
}
User.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // validates email format will send back an error is its wrong 400 error
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8],
        //is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // the plus means there needs to be just one regular expression 
      },
    },
    role: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    dob: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [5, 5],
      },
    },
  }, 
  {
      // When adding hooks via the init() method, they go below
      hooks: {
      // Use the beforeCreate hook to work with data before a new instance is created
      beforeCreate: (newUserData) => hashPassword(newUserData), //(POST methods)
      // Here, perform a check before updating the database.
      beforeUpdate: (newUserData) => hashPassword(newUserData), //(PUT methods)
      },

    sequelize,
    tableName: 'users',
    freezeTableName: true,
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
module.exports = User;