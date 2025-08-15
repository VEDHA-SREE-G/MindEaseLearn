const dbConfig = require('../config/db.config');
const {Sequelize, DataTypes} = require('sequelize');
dbConfig.authenticate()
.then(()=>{
    console.log("db connected successfully")
})
.catch((error)=>{
     console.log("error : "+ error)
})
db = {}
db.Sequelize = Sequelize
db.sequelize = dbConfig
db.scontents = require('./scontent.model.js')(dbConfig, DataTypes);
db.sequelize.sync({force : false})
.then(()=>{
    console.log("db synced successfully");
})
.catch((error)=>{
    console.log("error : " + error);
})
module.exports = db