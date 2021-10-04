const Educator = require('../controller/Educator.controller.js'); 
const Assessment = require('../controller/Assessment.controller.js');
const validator = require("../middleware/validator.js");
const Notes  = require('../controller/Notes.controller.js');
const Outlier  = require('../controller/Outlier.controller.js');
const Notification = require('../controller/Notification.controller.js')
const Student = require('../controller/Student.controller')
var router = require("express").Router();

// gets all currently logged in student's feedback 
router.post("/getAllFeedback", Student.getAllFeedback);

//gets all currently logged in students dispute threads
router.post("/getAllDispute", Student.getAllDispute);

//Gets specific threads history
router.post("/getThreadHistory",Student.getThreadHistory);

// Adds a message to a thread 
router.post("/addMessageToThread", Student.addMessageToThread);

// Student disputes a mark 
router.post("/addNewDispute",Student.addNewDispute)

module.exports = router;