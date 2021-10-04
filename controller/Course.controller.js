//All API calls for courses table

//Variables
const { Assessment, Sequelize } = require("../models");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { getModuleID } = require("./Module.controller")
const { validationResult } = require('express-validator/check');
const { Op, DATE } = require("sequelize");

//Add Courses
exports.addCourse = async (req,res) => {

    //Get module ID
    console.log(req.body.details.ModuleId.name);
    const modID = await Module.findOne({
      where : {moduleCode : req.body.details.ModuleId},
      attributes : ["id"]
    })

    await Course.create({
      year: req.body.details.year,
      active: req.body.details.active,
      ModuleId: modID.dataValues.id
    }).then(async (courses) => {
        if(courses)
          res.send(courses)
      });
}

// ISSUE: This function only returns module names for add course functionality and does not actually return courses
// This function gets the names of the courses to display in a drop down
exports.getCourseList = async(req, res) => {
    console.log('Entered get Course list');
    var CoursesObject = new Object;
    var size;
    try{
      await Module.findAll({
        attributes: ["moduleCode"]
      }).then(async (data) => {
        size = data.length
        for(var i =0; i < size; i++)
        {
          console.log(data[i].dataValues.moduleCode);
          CoursesObject['module'+i] = data[i].dataValues.moduleCode;
        }
        console.log(CoursesObject);
        res.status(200).json(CoursesObject)

      })

    }
    catch(error){
      console.log(error);
      res.status(500).json({
          message: "Retrieving course Error!",
          error: error
        })
    };
}

exports.updateCourse = async(req, res) => {

  console.log(req.body.details.modCode);
  console.log(req.body.details.active);
  var modId;
    const modInfo = await Module.findOne({
      where : {
        moduleCode : req.body.details.modCode,
        active : true
      }
    })

    console.log(modInfo.dataValues.id);
    await Course.findOne({
      where : 
        {
            ModuleId : modInfo.dataValues.id,
            year : req.body.details.year
            
        }

    }).then(async(data) => {

            data.update({
              active : req.body.details.active
            })
  
            })


}

/**
 *  Helper function call to to get current year courseID given a module name.
 * @param {string} modName - module name
 */
exports.getCourseIDFromModuleName = async(modName) => {
  var courseID;
  const currentYear = new Date().getFullYear();
  var modID = await getModuleID(modName).then(res => res);
  try {
    await Course.findOne({
      where: {ModuleId: modID, year: currentYear},
      attributes: ["id"]
    }).then(async (data) => {
      courseID = data.dataValues.id; // should only return one, as it should be unique for 1 year
        console.log("Retrieved course ID");
    })
  }
  catch(error){
    console.log(error);
  }
  return courseID;
}