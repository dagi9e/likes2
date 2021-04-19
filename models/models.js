const {Model, DataTypes, Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "../temp.db"
})

class User extends Model {}
User.init({
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
}, {sequelize})


class Message extends Model{}
Message.init({
    content: DataTypes.STRING,
    time: DataTypes.TIME,
    messageID:DataTypes.STRING,//this is the message ID created by m_count
}, {sequelize})


class Like extends Model {}//this is the new data base table for likes
// it will get the message ID for eack message being created and then it will store the count for each messaage
//each messageID must be unique to eac message
Like.init({
    messageID:DataTypes.STRING,//this is the message ID created by m_count
    L_counts:DataTypes.STRING,//this will contain the like counts of the message
}, {sequelize})



User.hasMany(Message)
Message.belongsTo(User);

Message.hasMany(Like)
Like.belongsTo(Message); // so that the code on line 10 of routes.js would find all the likes in the sql database 

(async()=>{
    sequelize.sync({force:true})
})()

module.exports = {
    User, 
    Message, 
    Like,//exprot the like model
    sequelize
}

