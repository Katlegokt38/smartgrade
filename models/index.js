const env = require('../config/env')
const Sequelize = require("sequelize");
var sequelize;
process.env.DATABASE_URL = 'postgres://yjxzgwhtjcqmob:0b997679dd9d773410e1b5651149611cf399e12e20f2815f2f9f4a7993949152@ec2-54-247-107-109.eu-west-1.compute.amazonaws.com:5432/d192hnsbhn9qcs'
if(process.env.DATABASE_URL){
    console.log('Found heroku db')
    try {
       sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect:  'postgres',
        dialectOptions: {
          ssl:{
            require: true,
            rejectUnauthorized: false
        }
      },
        protocol: 'postgres',
        logging:  true, //false
       
      });
    } catch (error) {
      console.log('Error in hosted')
      console.log(error)
    }
  
  }
  /*
  else{ // local host
    console.log('Did not find heroku db')
    try {
      sequelize = new Sequelize(env.database, env.username, env.password, {
        host: env.host,
        dialect: env.dialect,
        port: env.port,
        logging: true  // set to true to see SQL queries 
      // operatorsAliases: false,
      //   pool: {
      //     max: env.max,
      //     min: env.pool.min,
      //     acquire: env.pool.acquire,
      //     idle: env.pool.idle
      //   }
      });
    } catch (error) {
      console.log('Error in local',error)
    }
    
  
  }*/

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
// Load models into DB object
db.User = require ("./User.model.js")(sequelize, Sequelize);
db.Role = require ('./Role.model.js')(sequelize, Sequelize);
db.Course = require ('./Course.model.js')(sequelize, Sequelize);
db.Module = require ('./Module.model.js')(sequelize, Sequelize);
db.Assessment = require('./Assessment.model.js')(sequelize, Sequelize);
db.Note = require('./Note.model.js')(sequelize, Sequelize);
db.Marks = require('./Marks.model.js')(sequelize, Sequelize);
db.AssessmentType = require('./AssessmentType.model.js')(sequelize, Sequelize);


db.User.hasMany(db.Role, { as: "roles"});

db.Role.belongsTo(db.User,{
    as : "User"
});

db.Role.belongsToMany(db.Course, {
    through: "Role_Course",
   // as: "courses",
   as: "Course"

});

db.Course.belongsToMany(db.Role,{
    through: "Role_Course",
    //as: "roles",
    as: "Role"
})

db.Course.belongsTo(db.Module,{
    as : "Module"
});

db.Course.hasMany(db.Assessment,{
  as: "assessments"
});

db.Module.hasMany(db.Course, { as: "courses"});

db.Assessment.belongsTo(db.Course,{
    as: "Course"
});

db.Assessment.hasMany(db.AssessmentType,{
    as: "AssessmentType"
});

db.AssessmentType.belongsTo(db.Assessment,{
    as : "Assessment"
});



db.User.hasMany(db.Note, { as: 'Note' });
db.Note.belongsTo(db.User, {  as: 'User' });

module.exports = db;
