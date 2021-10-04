//All API calls for modules table

//Variables
const { Assessment, Sequelize } = require("../models");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { validationResult } = require('express-validator/check');
const { Op, DATE } = require("sequelize");

//Get Course Details

//Add Module
exports.addModule = async (req,res) => {
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
       console.log(errors.array())
       return res.status(422).json({ errors: errors.array() });
     }
     else{

     await Module.create({
       moduleCode: req.body.details.modCode,
       moduleName: req.body.details.modName,
       active: req.body.details.active
     }).then((data) => {
       console.log('Added a new module with details :' + data);
       res.status(200).json(data);
       })
     }
}

//Display Module
exports.displayModule = async(req, res) => {

    await Module.findAll({
      include : ["courses"]
    }).then(async(data) => {
  
      console.log(data);
      if(data[0] != null)
          res.status(200).json(data)
    })
  
}

//Update Module
exports.updateModule = async(req, res) => {

    await Module.findOne({
      where : {moduleCode : req.body.details.oldmodCode}
    }).then(async(data) => {
        data.update({
          moduleCode : req.body.details.modCode,
          moduleName : req.body.details.modName,
          active : req.body.details.active
        })
        res.status(200);
    })
}


/**
 *  Helper function call to to get moduleID given module name.
 * @param {string} modName - module name
 */

exports.getModuleID = async(moduleName) => {
  var modID;
  try {
    await Module.findOne({
      where: {moduleCode: moduleName},
      attributes: ["id"]
    }).then(async (data) => {
        console.log(data.dataValues)
        modID = data.dataValues.id;  // should be returning one value only
        console.log("Retrieved module ID",modID);
    })
  }
  catch(error){
    console.log(error);
  }
  return modID;
}
