const { Assessment, Sequelize, Marks } = require("../models");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { validationResult } = require('express-validator/check');
const { Op, DATE } = require("sequelize");

const CsvParser = require("json2csv").Parser;

exports.download = async(req, res) => {

  console.log(req.body.details.type)

    if (req.body.details.type == 'Users') {
      await User.findAll().then((objs) => {
          let users = [];
      
          objs.forEach((obj) => {
            const { id, firstName, lastName, upNumber, active } = obj;
            users.push({ id, firstName, lastName, upNumber, active });
          });
      
          const csvFields = ["id", "firstName", "lastName", "upNumber", "active"];
          const csvParser = new CsvParser({ csvFields });
          const csvData = csvParser.parse(users);
      
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=users.csv");
          
          res.status(200).json(csvData);
        });
    }
    else if (req.body.details.type == 'Modules') {
      await Module.findAll().then((objs) => {
        let modules = [];
      
          objs.forEach((obj) => {
            const { id, moduleCode, moduleName, active } = obj;
            modules.push({ id, moduleCode, moduleName, active });
          });
      
          const csvFields = ["id", "moduleCode", "moduleName", "active"];
          const csvParser = new CsvParser({ csvFields });
          const csvData = csvParser.parse(modules);
      
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=modules.csv");

          res.status(200).json(csvData);
      });
    }
    else if (req.body.details.type == 'Courses') {
      await Course.findAll().then((objs) => {
        let courses = [];
      
          objs.forEach((obj) => {
            const { id, year, active, moduleId } = obj;
            courses.push({ id, year, active, moduleId });
          });
      
          const csvFields = ["id", "year", "active", "moduleId"];
          const csvParser = new CsvParser({ csvFields });
          const csvData = csvParser.parse(courses);
      
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=courses.csv");

          res.status(200).json(csvData);
      });
    }
    else if (req.body.details.type == 'Assessments') {
      await Assessment.findAll().then((objs) => {
        let assessments = [];
      
          objs.forEach((obj) => {
            const { id, assessmentType, assessmentName, perWeight, active, total, courseId } = obj;
            assessments.push({ id, assessmentType, assessmentName, perWeight, active, total, courseId });
          });
      
          const csvFields = ["id", "assessmentType", "assessmentName", "perWeight", "active", "total", "courseId"];
          const csvParser = new CsvParser({ csvFields });
          const csvData = csvParser.parse(assessments);
      
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=assessments.csv");

          res.status(200).json(csvData);
      });
    }
    else if (req.body.details.type == 'Marks') {
      await Marks.findAll().then((objs) => {
        let marks = [];
      
          objs.forEach((obj) => {
            const { id, studentNumber, courseId, assessmentId, mark, totalMark, perWeight } = obj;
            marks.push({ id, studentNumber, courseId, assessmentId, mark, totalMark, perWeight });
          });
      
          const csvFields = ["id", "studentNumber", "courseId", "assessmentId", "mark", "totalMark", "perWeight"];
          const csvParser = new CsvParser({ csvFields });
          const csvData = csvParser.parse(marks);
      
          res.setHeader("Content-Type", "text/csv");
          res.setHeader("Content-Disposition", "attachment; filename=marks.csv");

          res.status(200).json(csvData);
      });
    }
}