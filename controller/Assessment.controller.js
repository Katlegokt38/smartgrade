/**
 * This file contains controller functions related to the assessment model.
 * @file
 */
const { Assessment } = require("../models");
const UserController = require("./User.controller");


/**
 * API invoked function call to get the names of all the different types of assessments.
 * @param {Object} req - The request recieved from the get API call.
 * @param {Object} res - The response that will be sent back.
 */
exports.getListOfAssessmentTypes = async (req,res) => {
  var assessmentTypes = exports.getAssessmentTypes();
  if (assessmentTypes !=null)
  {
    res.status(200).json(assessmentTypes);
  }
  else{
    res.status(500).json({error:'Could not retrieve list of assessments'});
  }
};


/**
 * Checks the Assessment model and gets all the enum values stored for assessmentType.
 * @function
 */
exports.getAssessmentTypes = () =>{
  var AssessmentTypeNames=Assessment.rawAttributes.assessmentType.values;
  var allTypes = [];
  for(var i=0;i<AssessmentTypeNames.length;i++)
  {
    var obj = new Object;
    console.log(AssessmentTypeNames[i]);
   obj['label']=AssessmentTypeNames[i];
   obj['value']=AssessmentTypeNames[i];
   allTypes.push(obj);
  }
return allTypes;
}


exports.addNewAssessment = async (courseID,input) => {
  var aID;
  //console.log('this is input ', input);
  // TODO: ABU - validation check on input comes here
  try {
   await Assessment.create({
     assessmentType: input.assessmentType,
     assessmentName: input.assessmentName,
     perWeight: input.weighting,
     total: input.maxMark,
     active: true,
     CourseId : courseID
   }).then((assessment) =>{
   //console.log('successfully added a new assessment: ',assessment);
   aID= assessment.dataValues.id;
    
   });
  }catch (error) {
   console.log(error)
 }
 return aID;;
}

exports.displayAssessment = async (req,res) => {

  var obj = [];
  var moduleId = await UserController.getModuleID(req.body.details.course);
  var courseId = await UserController.getCourseID(moduleId);

  await Assessment.findAll({
    where : {
      CourseId : courseId,
      active : true
    }
  }).then(async(data) => {

      console.log(data);

      for(var i = 0; i < data.length; i++)
      {
        obj.push({
          id : data[i].dataValues.id,
          type : data[i].dataValues.assessmentType,
          name : data[i].dataValues.assessmentName
        })
      }

      res.status(200).json(obj);
    })

}
  
