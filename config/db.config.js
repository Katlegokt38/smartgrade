const Sequelize = require('sequelize');



try{
sequelize
  .authenticate().then(function(err) {
    console.log('Connection has been established successfully.');
  })}
  catch(err){
    console.log('Unable to connect to the database:', err);
  };



 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.User = require('../models/users.js')(sequelize, Sequelize);
 
module.exports = db;