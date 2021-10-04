const Educator = require('../controller/Educator.controller.js'); 
const Assessment = require('../controller/Assessment.controller.js');
const validator = require("../middleware/validator.js");
const Notes  = require('../controller/Notes.controller.js');
const Outlier  = require('../controller/Outlier.controller.js');
const Notification = require('../controller/Notification.controller.js')
var router = require("express").Router();




// get All assessments for an educator
router.post("/getAssessments",validator.getAssessments,Educator.getAssessments)

// update the active field for an assessment
router.post("/updateAssessmentActive",Educator.updateAssessmentActive)


// Assessment functions

//Returns a list of all assessment types
router.get("/getListOfAssessmentTypes", Assessment.getListOfAssessmentTypes)

//Get list if students for specific module
router.post("/getStudentInfo", Educator.getStudentInfo)

//Update student info (active)
router.put("/updateStudent", Educator.updateStudent)

//Get list of student marks for specific module
router.post("/getStudentMark", Educator.getStudentMark)

//Update student mark
router.put("/updateMarks", Educator.updateMarks)

//Upload the marksheet and add to database marks table
router.post("/uploadMarkSheet", Educator.uploadMarkSheet)

// Upload classlist to add !existing studentst to course
router.post("/uploadClassList",Educator.addClassList)

//getNotes of educator assigned course
router.post("/getNotes", Notes.getNoteReq)

//adds note from educator to a student 
router.post("/addNote", Notes.addNoteReq)

// add feedback for a student.
router.post("/addStudentFeedback",Notification.addStudentFeedback)

//outliers for student marks
router.post("/interquartile", Outlier.interquartile)
router.post("/zscore", Outlier.zscore)

//Display assessments in the form of a drop down
router.post("/displayAssessment", Assessment.displayAssessment)

// get all feedbacks from an educator
router.post("/getAllStudentFeedback",Notification.getAllStudentFeedback)

// get all disputes to an educator
router.post("/getAllStudentDispute", Notification.getAllStudentDispute)

// get history of thread 
router.post("/getThreadHistory", Notification.getThreadHistory)

// add a reply to a thread
router.post("/addMessageToThread", Notification.addMessageToThread)

router.post("/changeThreadStatus", Notification.changeThreadStatus)

module.exports = router;
