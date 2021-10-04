const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const Assessment = db.Assessment;
const { validationResult } = require('express-validator/check');


exports.getCount = async (req,res) => {
  console.log('Entered admin/getCount function');
  var courseCount = 0;
  var moduleCount = 0;
  var educatorCount = 0;
  var studentCount = 0;
  var Obj = new Object;
  Obj['Courses'] = await Course.count();
  Obj['Modules'] = await Module.count();
  Obj['Educators']= await Role.count({where:{roleType:'Educator'}});
  Obj['Students']= await Role.count({where:{roleType:'Student'}});;
  console.log('returning object' + Obj);
  res.status(200).json(Obj);
}
