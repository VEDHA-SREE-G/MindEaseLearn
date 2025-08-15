module.exports = (sequelize, DataTypes) => {
const Scontent = sequelize.define("scontent",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false
    },
    body : {
        type : DataTypes.TEXT('long'),
        allowNull : false
    }
})
return Scontent
}