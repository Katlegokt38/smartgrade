/**
 * @file
 * This file contains controller functions related to the educator use case functions.
 * 
 */

const db = require("../models");
const { getModuleDetails } = require("./User.controller");
const { getCourseIDFromModuleName } = require("./Course.controller")
const {addNewAssessment} = require("./Assessment.controller")
const {addMarks} = require("./Marks.controller")
const {assignRoleCourse} = require("./Role.controller")
const Assessment = db.Assessment;
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { Marks } = require("../models");
const { validationResult } = require('express-validator/check');
const UserController = require("./User.controller");
const { stat } = require("fs");


/**
 * Fhis function is given an array of courseIDs return their 'module' names.
 * @param {Object} req - The request recieved from the get API call.
 * @param {Object} res - The response that will be sent back.
 */
 // TODO: check which function needs this call 
exports.getCourseNames = async (courseIDs) => {
  var courseNames = [];
  if(courseIDs.length == 0){
    // handle and return null
  }
  for(var i=0;i< courseIDs.length;i++)
  {
    try{
    await Course.findAll({
      where : {
      id:courseIDs[i],
      year: new Date().getFullYear()
    }
      }).then(async (data) => {
      //console.log('Name of course found : ');
      //console.log(data);
    var moduleCodes = await getModuleDetails(data[0].dataValues.ModuleId);
    var obj = new Object;
    obj['name']=moduleCodes[0];
    courseNames.push(obj);
    //console.log(courseNames);
    // data[0].course
    });
    }catch (error) {
      console.log(error);
    }
  }
return courseNames;
}



/**
 * API invoked function to return a list of all assessments for all courses of an educator
 * @param {Object} req - The request recieved from the get API call. List of courseIDs
 * @param {Object} res - The response object containing courseDetails and assessments that will be sent back.
 */
exports.getAssessments = async (req,res) => {

  const errors = validationResult(req); 
  if (!errors.isEmpty()) {  // if there were input validation errors do not proceed further
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() });
  }
  else {
    //console.log('Received request in educator get assessment: ');
    //console.log(req.body);
    var reqDetails = req.body;
    // Assign courseIDs to array
    var arrID = [];
    reqDetails.courses.forEach(elem => {
      arrID.push(elem.courseID)
    });
    
    var data = await exports.getListOfAllEducatorAssessments(arrID).then(res => res);
    var numOfAssessments = data.length;
    if(numOfAssessments > 0){
      var courseAssessmentObj = [];
    // Build JSON object to be returned
    reqDetails.courses.forEach(elem => {
      var newRow = new Object;
      newRow['courseCode'] = elem.courseCode;
      newRow['courseID'] = elem.courseID;
      var assessmentArray = [];
      for(var i=0;i< numOfAssessments; i++)
      {
        if (data[i].CourseId == elem.courseID){
          var obj = new Object;
          obj['assessmentID'] = data[i].id;
          obj['assessmentName'] = data[i].assessmentName;
          obj['assessmentType'] = data[i].assessmentType;
          obj['weight'] = data[i].perWeight;
          obj['active'] = data[i].active;
          assessmentArray.push(obj);
        }
      }
      newRow['assessments'] = assessmentArray;
      courseAssessmentObj.push(newRow);
    });
    res.status(200).json(courseAssessmentObj)
    }
    else{
      res.status(204).json({'error':'No assessments found'});
    }
  }
}

/** Unit tests done
 * function that gets all assessment details for given array of courseIDs
 * @param {Array<Int16Array>} arrID - array containing courseIDs.
 */
  exports.getListOfAllEducatorAssessments = async (arrID) => {
    var aData;
    if(arrID.length==0)
    {
      console.log('Identified empty array input ')
      throw new Error('courseID input array is empty')
    }
    else{

      try {
        await Assessment.findAll({
          where : {CourseId : arrID},
          order: [['CourseId','ASC']]
        }).then(async(data) => {
         // console.log(data);
          var numOfAssessments = data.length;
          if(numOfAssessments > 0){ // non zero number of assignments found 
            aData=data;
          }
          else // if 0 assessments returned, or course doesnt exist? 
          {
            aData= [];  // return empty array with length 0
          }
          })
        } catch (error) {
          console.log(error);
          }
      }
      return aData;
  }



/** 
 * API invoked function that updates the active status of an assessment. 
 * @param {Object} req - req object contataining assessmentID and status boolean value
 * @param {Object} res - res Object that will return true or false based on success of changing assessment active status
 */

 //TODO: This only updates the active/non-active field for assessments.
exports.updateAssessmentActive = async (req,res) => {
 // console.log('Recieved upate of assessment active status type with body');
 // console.log(req.body);
 if(req.body.details.active == undefined || req.body.details.assessmentID == undefined ){
  res.status(204).json({'status':'error','message':'Incomplete req parameters'});
  }
 else{
    var aID = req.body.details.assessmentID;
    var status = req.body.details.active;
    var result = await exports.changeAssessmentActiveStatus(aID,status).then(res=>res);
    console.log(result);
    if(result){
      res.status(200).send({status:'success', message:'changed status successfully'});
      }  
    else{
      res.status(400).send({
        status: false,
        message: 'Request not complete'
        });
    }
  }
}
   
       
  



/** 
 *  Function that updates the active status of an assessment. 
 * @param {Int16Array} assessmentID - Integer containing assessmentID 
 * @param {boolean} status - contains status boolean value to change to
 */
exports.changeAssessmentActiveStatus = async (assessmentID,status) => {

  var updated = false; // if updated or not
  
  if(assessmentID==null || status == null)
  {
    throw Error('incomplete input parameters');
  }
  else{
    try {
      await Assessment.update(
        {active: status},
        {where: {id:assessmentID}}
      ).then(async(data) => {
        console.log(data);
        if (data[0]==1)
        updated = true;
        else
        updated = false;
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  return updated;
}


/**  API invoked function that gets student info for the educators courses. 
* @param {Object}  req - req object containing module name
* @param {Object}  res - response object containing all the names/details of the student partaking in the above module/course
*/
//Get list of students for specific module
exports.getStudentInfo = async (req, res) => {
if(req.body.details.course == undefined){
  res.status(400).send({
    status: false,
    message: 'Incomplete request'
    });
}
else{
  var moduleId = await UserController.getModuleID(req.body.details.course);
  var courseId = await UserController.getCourseID(moduleId);
 // console.log(courseId);
  var data =  await exports.getStudentsInfoFromCourseID(courseId);
 if(data[0] != null){
  res.status(200).json(data)
 }
 else{
  res.status(400).send({
    status: false,
    message: 'Request not complete'
    });
 }
}
}

/**  Function returns all information of enrolled student in specified courseID
* @param {Int16Array} courseID - Course ID input value 
*/
exports.getStudentsInfoFromCourseID = async (courseID) => {
  var dataObj;
  console.log('Entered getStudentsInfo from courseID with courseID: ',courseID)
  if(courseID == null)
  {
    throw Error('invalid parameter for course ID')
  }
  else{
    await User.findAll({
      include: ["roles"]
  
    }).then(async(data) => {
      var obj = [];
      var rObj = data;
      var size = rObj.length;
      for(var i=0; i < size ; i++)
      {
        var roleObj = data[i].dataValues.roles;
        var nrOfRoles =  roleObj.length;
  
        for(var j=0; j < nrOfRoles ; j++)
        { 
          if(roleObj[j].roleType == "Student" )
          { 
            const course = await roleObj[j].getCourse();
            //console.log(course);
            course.forEach(elem => {
              console.log('element : ',elem)
              if( elem.dataValues.id == courseID)
              {
                obj.push({
                  firstName : data[i].dataValues.firstName,
                  lastName : data[i].dataValues.lastName,
                  upNumber : data[i].dataValues.upNumber,
                  email : data[i].dataValues.email,
                  active : data[i].dataValues.active
                })
  
              }
            })
          
            
          }
        }
      }
      dataObj = obj;
   
    })
  }
  console.log(dataObj);
  return dataObj;
}


//Update Student details
exports.updateStudent = async(req, res) => {
  await User.findOne({
    where : {email : req.body.details.oldemail}
  }).then(async(data) => {
      data.update({
        active : req.body.details.active
      })
      res.status(200)
  })

}

//Retrieve the student mark
exports.getStudentMark = async(req, res) => {
  var obj = [];
  var moduleId = await UserController.getModuleID(req.body.details.course);
  var courseId = await UserController.getCourseID(moduleId);

  
  
  await Marks.findAll({
    where : {
      courseId : courseId
    }
  }).then(async(data) => {
    
   // console.log(data);
    for(var i = 0; i < data.length; i++)
    {
      var assessmentData = await exports.getAssessmentNameAndType(data[i].dataValues.assessmentId);
      var id = data[i].dataValues.assessmentId;
      var assessmentName = assessmentData.assessmentName;
      var assessmentType = assessmentData.assessmentType;
      obj.push({
        upNumber : data[i].dataValues.studentNumber,
        assessment : {assessmentName, assessmentType, id},
        mark : data[i].dataValues.mark,
        totalMark : data[i].dataValues.totalMark,
        weight : data[i].dataValues.perWeight
      })
    }

    res.status(200).json(obj);

  })

}
//
//Helper function for getting assessment name
exports.getAssessmentNameAndType = async(id) => {
  var obj = {};
  var aName;
  await Assessment.findOne({
    where : {
      id : id
    }
  }).then(async(data) => {
    
    obj['assessmentName'] = data.dataValues.assessmentName
    obj['assessmentType'] = data.dataValues.assessmentType
    //aName = data.dataValues.assessmentName;
  })

  return obj;

}

//Update Student details
exports.updateMarks = async(req, res) => {
  await Marks.findOne({
    where : {studentNumber : req.body.details.sNumber,
    assessmentId : req.body.details.assessment}
  }).then(async(data) => {
      data.update({
        mark : req.body.details.mark
      })
  })

}


/**
 * API invoked function call to upload the marksheet details to the database.
 * @param {Object} req - The request body recieved from the post API call.
 * e.g data {courseName:'COS301', assessmentDetails: [], markSheet: []}
 * @param {Object} res - The response that will be sent back.
 */
exports.uploadMarkSheet = async (req,res) =>{
 // console.log('Server : recieved req at uploadMarkSheet with req = ');
 // console.log(req.body.data);
  var result;
  var inputData = req.body.data;
  var courseName = inputData.courseName;
  var courseID = await getCourseIDFromModuleName(courseName).then(res => res);
 // console.log('in educator controller I have ID ',courseID);
  var assessmentID;
  var assessmentData = inputData.assessmentDetails;
  var markSheet = inputData.markSheet;
  assessmentData.forEach(async element  => {
    var label = element.label; // for the marks adding to map to whatever new assessment name it is
    var maxMarks = element.maxMark;
    var weighting = element.weighting;
   // console.log('3 :', inputData.markSheet[0].Student, inputData.markSheet[0][label]);
    var marks = [];
    if(label!='Student'){  // skips first element or rather do traditional for loop
       assessmentID = await addNewAssessment(courseID,element).then(res => res);
      // console.log('Aftert all we got assessment ID = ' , assessmentID)
       markSheet.forEach(row => {
        var markObj = new Object;
        markObj['Student'] = row.Student;
        markObj['Mark'] = row[label];
        marks.push(markObj);
      });
    }
    await addMarks(courseID,assessmentID,marks,weighting,maxMarks).then(res=>res)

  });
  // send response 
  res.status(200).json({'status':'Successfully uploaded'})
}


/**
 * API invoked function call to upload the class list details to the database.
 * @param {Object} req - The request body recieved from the post API call.
 * e.g data {courseName:'COS301', classList:[]}
 * @param {Object} res - The response that will be sent back.
 */
exports.addClassList = async (req,res) => {
 // console.log('Entered addClassList function')
//console.log(req.body.data)
var courseID;
var courseName = req.body.data.courseName;
var classListData = req.body.data.classList;
courseID = await getCourseIDFromModuleName(courseName).then(res=>res);

classListData.forEach(async element => {
  var obj = new Object;
  obj['firstName'] = element.Fullname.toString();
  obj['lastName'] = element.Lastname.toString();
  obj['active'] = false; // active once self-enrolled
  obj['upNumber'] = element.StudentNumber.toString();
  obj['email'] = element.Email.toString();
  
  try {
    await User.findOrCreate({
      where: {upNumber : obj.upNumber},
      defaults : obj
    }).then(async(res)  =>{
       // console.log('User found with ID = ', res[0].dataValues.id);
        userID = res[0].dataValues.id;
        
        roleID = await exports.addStudentRole(userID).then(res=>{
         // console.log('then of addSTudentRole: ',res);
          assignRoleCourse(res,courseID);
        });
      // have userID and roleID
      
    });
    } catch (error) {
     console.log(error)
     throw error
  }
  
});
res.status(200).json('success')

}

/**
 * Adds a new role for a student with given userID
 * @param {string} id - This is the userID that will map to a student role 
 */
exports.addStudentRole = async(id) => {
  //console.log('addStudentRole entered with id =', id)
  var userID = id;
  var roleID;
  var obj = new Object;
  obj['roleType'] = 'Student';
  obj['UserId'] = parseInt(id);
  obj['active'] = false;
  try {
    await Role.findOrCreate({
      where: {UserId : obj.UserId, roleType:'Student'},
      defaults : obj
    }).then((res) => {
     // console.log(res); 
      roleID = res[0].dataValues.id; 
      console.log(roleID);
    });
  }
  catch(error){
    console.log(error);
  }
  return roleID;
}


// Functions no longer in use 


/*
 exports.addAssessmentPop = async (req,res) => {
  console.log('Recieved request in educator add assesment pop : ');
  console.log(req.body);
  var courseIDs = req.body.courseIDs;
  var mainObj = new Object;

  var allTypes = await exports.getAssessmentTypes();
  mainObj['assessmentTypes'] = allTypes;

  var courses = await exports.getCourseNames(courseIDs);
  mainObj['courses'] = courses;
 // console.log(mainObj)
  res.status(200).json(mainObj);
}

*/


/**
 * This function is called by the API router and adds a new assessment 
 * @param {Object} req - The request recieved from the get API call.
 * @param {Object} res - The response that will be sent back.
 */

 /* 
exports.addAssessment = async (req,res) => {
  //console.log('Recieved request in educator add assessment : ');
  //console.log(req.body);
if(!req.body.details.weight)
{
  console.log("Error : Incomplete request");
  res.status(400).send({
    status: false,
    message: 'Incomplete request'
});
}
else{
 try {
   await Assessment.create({
     assessmentType: req.body.details.assessmentType.name,
     assessmentName: req.body.details.assessmentName,
     perWeight: req.body.details.weight,
     active: true,
     CourseId : req.body.details.courseID
   }).then((assessment) =>
   res.status(200).json({assessment})
   )
 } catch (error) {
   console.log(error)
 }
  }
}
*/