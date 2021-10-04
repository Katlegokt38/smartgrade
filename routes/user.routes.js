const User = require("../controller/User.controller.js"); //User functions
const Educator = require("../controller/Educator.controller.js"); //Educator functions
const Module = require("../controller/Module.controller.js"); //Module functions
const Course = require("../controller/Course.controller.js"); //Course functions
const CSV = require("../controller/CSV.controller.js");

const router = require("express").Router();

//OKTA 
var jwtAuth = require('../config/auth');

const validator = require("../middleware/validator");
const { Assessment } = require("../models/index.js");

//USER
// Initial User sign on route
router.get("/getUserDetails", jwtAuth, User.getUserDetails);
router.post("/token", User.token);

// Add user from admin panel route
router.post("/addUser", User.addUser);
router.get("/getModuleDetails", User.getModuleDetails);
router.post("/displayUserInformation", User.displayUserInformation);

//COURSE
router.get("/getCourseList", Course.getCourseList);
router.post("/addCourse", Course.addCourse);
router.put("/updateCourse", Course.updateCourse);

//ADMIN
router.put("/updateAdmin", User.updateAdmin);
router.post("/getAdminUsers", User.getAdminUsers);
router.post("/displayAssessment", User.displayAssessment);
router.post("/addAssessmentType", User.addAssessmentType);

//EDUCATOR
router.put("/updateEducator", User.updateEducator);

//MODULE
router.post("/addModule", validator.addModule, Module.addModule);
router.get("/displayModule", Module.displayModule);
router.put("/updateModule", Module.updateModule);

//CSV
router.post("/download", CSV.download);

//Student Marks
router.post("/getMarks", User.getMarks);
router.post("/studentBarGraph", User.studentBarGraph);
router.post("/educatorBarGraph", User.educatorBarGraph);

//Assessment
router.put("/updateAssessment", User.updateAssessment);

module.exports = router;




