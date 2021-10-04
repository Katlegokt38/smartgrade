const { Assessment, Sequelize } = require("../models");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;
const { Marks } = require("../models");
const { AssessmentType } = require("../models");
const { validationResult } = require('express-validator/check');
const { Op, DATE } = require("sequelize");
var helper = require("./Educator.controller");

//Token
const nJwt = require('njwt');
const jwtConfig = require('../config/jwtConfig');


exports.getUserDetails = async (req,res) => {
  console.log("SERVER : Received a getUserDetails request with input:");
  console.log(req.query);
  var userEmail = req.query.user.toString();
  userEmail = userEmail.toLowerCase();
  var detailsObject = new Object;
  var roleIDKey = 'roleID';
  var roleTypeKey = 'roleType';
  var coursesKey = 'courses';

try{
  await User.findAll({

      where: { email: userEmail},
      include: ["roles"],
    }).then(async(data)  =>  {
      console.log(data[0].dataValues);
      var userObj = data[0].dataValues;
      var roleObj = userObj.roles;
      var nrOfRoles =  roleObj.length ;
      detailsObject['name'] = userObj.firstName + ' ' + userObj.lastName;
      detailsObject['lastLogin'] = new Date(Date.parse(userObj.lastLogin)).toString();
      // Update to current login time
      console.log(userObj.id);
      var signOn = await exports.updateSignOnTime(userObj.id);
     // console.log(nrOfRoles);
      for(var i=0; i < nrOfRoles ; i++)
      {
        var obj = new Object;
        obj[roleIDKey] = roleObj[i].id;
        obj[roleTypeKey] = roleObj[i].roleType;

        // for loop
        if(roleObj[i].roleType != 'Admin'){ //ignore Admin case checking for courses and modules
            var coursesInfo = new Object(await exports.getCourseDetails(roleObj[i].id));

          // coursesObj[courseIDKey] = 5;  //coursesInfo[0].id
          // coursesObj[courseNameKey] = "COS301"; //coursesInfo[0].courseName
            if(coursesInfo != null)
            {
              obj[coursesKey] = coursesInfo;
              detailsObject['data_'+i]=obj;
            }
        
        }
        else{
          detailsObject['data_'+i]=obj;
        }
        
      }
      detailsObject['UPNumber'] = userObj.upNumber;
      console.log("Serverside object = ");
      console.log(detailsObject);
      if(data[0] != null)
        res.status(200).json(detailsObject)
    })
    }catch(error){
    //console.log(error);
    res.status(500).json({
        message: "Retrieving user details Error!",
        error: error
    });
  }};


exports.updateSignOnTime = async (userid) => {
  console.log('entered update sign on time function with id =');
  console.log(userid);
  try {
    await User.update(
       {lastLogin : Sequelize.literal('CURRENT_TIMESTAMP') },
       { where: {id: userid}}
      ).then(async(data)  =>  {
        console.log(data);
      })

  } catch (error) {
    console.log(error)
  }

}
 exports.getCourseDetails =  async(roleID) => {
   console.log('Entered getCourseDetails')
var obj =[]; // { CourseID: x , CourseName: }
var courseIDKey = 'courseID';
var courseCodeKey = 'courseCode';
var courseName = 'courseName';
   try {
   await Role.findAll({
      where: {
        id : roleID
      },
      include:["Course"]
    }).then(async (data) => {

      if(data[0].dataValues.Course[0].dataValues.active == true)
      {
        console.log("Got from roles table this data: ");
        console.log(data[0].dataValues.Course[0].dataValues.active)
        var CourseDet = data[0].dataValues.Course;
        var crsobj = data[0].dataValues.Course;
       // console.log("Length of Courses : ");
       //console.log(data[0].dataValues.Course.length);
       var arrSize = data[0].dataValues.Course.length;
       for(var i=0;i<arrSize;i++){
         var newObj  = new Object;
        newObj[courseIDKey]=CourseDet[i].id;
        var modDetails= await exports.getModuleDetails(CourseDet[i].ModuleId);
        newObj[courseCodeKey]= modDetails[0];
        newObj[courseName] = modDetails[1];
        obj.push(newObj);
       }
      }
     
     // console.log("Keys in object \n");
     // console.log(Object.keys(crsobj));
     // console.log(crsobj)


    });
   } catch (error) {
    console.log(error);
   }
   console.log(obj);
   return obj;
  }

  // This helper function gets module code and module Name details as an array given moduleID as input
  exports.getModuleDetails = async(moduleID) => {
    // return 1 course name
    var code = [];
    try{
   await Module.findAll({
      where: { id :  moduleID}
    }).then(async (data) => {
    //  console.log("Got data from Module table: ")
    // console.log(data);
     // console.log(data[0].moduleCode)
      code[0]= data[0].moduleCode;
      code[1]= data[0].moduleName;
      code[2]= data[0].active;
    })}
    catch (error) {
   console.log(error);
  }
  return code;
  }

exports.addUser = async (req,res) => {

  try {
    await User.create({
      firstName: req.body.details.firstname,
      lastName: req.body.details.lastname,
      upNumber: req.body.details.upnumber,
      email: req.body.details.email,
      active: req.body.details.active
    }).then(async (users) => {
      if (users) {
        res.status(200);
        res.send(users);
        var userId = await exports.getUserID(req.body.details.email);
        if(req.body.details.role == "Educator")
        {
          for(var i = 0; i < req.body.details.courses.length; i++)
          {
                var moduleId = await exports.getModuleID(req.body.details.courses[i]);
                var courseId = await exports.getCourseID(moduleId);
                await exports.addRole(userId, req.body.details.role, courseId);
          }
        }

        else
        {
          await exports.addRole(userId, req.body.details.role, courseId);
        }
        
      }
      else {
        res.status(400).send('Error in insert new record');
      }
    })

  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Adding User Error!",
      error: error
    });
  }
}

exports.getUserID = async(userEmail) => {

  console.log("Getting user ID");
  var id;
  try{
    await User.findAll({
      where: {email: userEmail },
      attributes: ["id"]
    }).then(async(data)  =>  {
          id = data[0].dataValues.id;
    })
  }
  catch(error){
    console.log(error);
    res.status(500).json({
        message: "Retrieving user details Error!",
        error: error
    });
  }
  return id;
}

exports.addRole = async(id, userRole, cId) => {

  var roleID;
  try {
    const ed = await Role.create({
      roleType: userRole,
      UserId: id,
      active: true
    });

    if(userRole == "Educator")
    {
      const cs = await Course.findOne({
        where : {id : cId}
      });

      await ed.addCourse(cs);
    }
  }
  catch(error){
    console.log(error);
  }
  return roleID;
}

// Different years for a course code ?
exports.getModuleID = async(courseCode) => {

  var modID;
  try {
    await Module.findAll({
      where: {moduleCode: courseCode },
      attributes: ["id"]
    }).then(async (data) => {
        modID = data[0].dataValues.id;
        console.log("Retrieved module ID");
    })
  }
  catch(error){
    console.log(error);
  }
  return modID;
}

// ISSUE : Can get multiple courses with different years for a modID
exports.getCourseID = async(modId) => {
  var courseID;
  try {
    await Course.findAll({
      where: {ModuleId: modId},
      attributes: ["id"]
    }).then(async (data) => {

      courseID = data[0].dataValues.id;
        console.log("Retrieved course ID");
    })
  }
  catch(error){
    console.log(error);
  }
  return courseID;
}


//Get a list of all the modules, year module code module name
/* {[ {
    CourseID: 1,
    Module Code: xxx
    Module Name: xxx
    Year: xxx
    Active: xxx
  }],
    [

    ]}
*/

exports.getCourseFromRole = async (role) => {

  var modID;
  await role.getCourse().then(async(data) => {
    modID = data[0].dataValues.id;
  })

  return modID;
}

exports.getModName = async (modID) => {

  var moduleName;
  await Module.findOne({
    where : {
      id : modID
    }
  }).then(async(data) => {
    // console.log(data);
    moduleName = data.dataValues.moduleCode;
  })

  return moduleName;
}

//Only retrieve Educators
// Seperate logic and .then
exports.displayUserInformation = async(req,res) => {
  // req does not matter, nut maybe check if user has privlege to vie wthis info?
  
  var num;
  await User.findAll({
    include: ["roles"]

  }).then(async(data) => {
    if(!data){
      // no users found i.r no educators or admin ( impossible for this case==true though because you could have only come here through the
      // admin portal)
    }
    var obj = [];
    var rObj = data;
    var size = rObj.length;
    for(var i=0; i < size ; i++)
    {
      var roleObj = data[i].dataValues.roles;
      var nrOfRoles =  roleObj.length;
      var isCourse = false;
      var courses = [];
      for(var j=0; j < nrOfRoles ; j++)
      { // Does not return admin
        if(roleObj[j].roleType == req.body.details.role )
        {

          if(isCourse == false)
          {
            for(var k = 0; k < nrOfRoles; k++)
            {
              console.log(roleObj[k])
              if(roleObj[k].dataValues.active == true  && roleObj[k].dataValues.roleType == "Educator")
              {
                var modID = await exports.getCourseFromRole(roleObj[k]);
                var modName = await exports.getModName(modID);
                courses.push(modName);
              }
              
            }
            isCourse = true;
          }

          if(obj.length == 0 )
          {
            obj.push({
              firstName : data[i].dataValues.firstName,
              lastName : data[i].dataValues.lastName,
              upNumber : data[i].dataValues.upNumber,
              email : data[i].dataValues.email,
              active : data[i].dataValues.active,
              course : courses
            })
          }

          else {

            if(data[i].dataValues.upNumber != obj[obj.length - 1].upNumber)
            {
              obj.push({
                firstName : data[i].dataValues.firstName,
                lastName : data[i].dataValues.lastName,
                upNumber : data[i].dataValues.upNumber,
                email : data[i].dataValues.email,
                active : data[i].dataValues.active,
                course : courses
              })
            }

          }
          
        }
      }
    }

    if(data[0] != null)
        res.status(200).json(obj)
  })
}


//Only retrieve Administrators
exports.getAdminUsers = async(req,res) => {
  await User.findAll({
    include: ["roles"]

  }).then(async(data) => {
    if(!data){
      // no users found i.r no educators or admin ( impossible for this case==true though because you could have only come here through the
      // admin portal)
    }
    var obj = [];
    var rObj = data;
    var size = rObj.length;
    for(var i=0; i < size ; i++)
    {
      var roleObj = data[i].dataValues.roles;
      var nrOfRoles =  roleObj.length;

      for(var j=0; j < nrOfRoles ; j++)
      { 
        if(roleObj[j].roleType == "Admin" )
        {
          obj.push({
            firstName : data[i].dataValues.firstName,
            lastName : data[i].dataValues.lastName,
            upNumber : data[i].dataValues.upNumber,
            email : data[i].dataValues.email,
            active : data[i].dataValues.active
          })
        }
      }
    }
    console.log(data[0]);
    if(data[0] != null)
        res.status(200).json(obj)
  })
}

//Set Roles to false
exports.setRoleActive = async(req, res) =>{

  console.log(req.body.details.course)
  var userId;
  await User.findOne({
    where : {
      email : req.body.details.email
    }
  }).then(async(data) => {
    // console.log(data.dataValues);
      console.log("Here")

    userId = data.dataValues.id;

    await Role.update({
      active : false},
      {where : {
        UserId : data.dataValues.id
      },
      
     })
  })

  return userId;

}

//Update Educator details
exports.updateEducator = async(req, res) => {

  await User.findOne({
    where : {email : req.body.details.oldemail}
  }).then(async(data) => {

      data.update({
        firstName : req.body.details.firstname,
        lastName : req.body.details.lastname,
        upNumber : req.body.details.upnumber,
        email : req.body.details.email,
        active : req.body.details.active
      })
      res.status(200).json(data);
  })
  var uID = await exports.setRoleActive(req, res);

  for(var i = 0; i < req.body.details.course.length; i++)
  {
    var setActive = false;
    var moduleId = await exports.getModuleID(req.body.details.course[i]);
    var courseId = await exports.getCourseID(moduleId);
    console.log(courseId);

    await Role.findAll({
      include : ["Course"],
      where : {
        UserId : uID
      }
    }).then(async(data) => {
      for(var i = 0; i < data.length; i++)
      {
        for(var j = 0; j < data[i].dataValues.Course.length; j++)
        {
          console.log(data[i].dataValues.id);
          if(courseId == data[i].dataValues.Course[j].dataValues.id)
          {
            setActive = true;
            await Role.update({
              active : true},
                {where : {
                  id : data[i].dataValues.id
                },
            })
          }
    
        }
      }
    })

    if(setActive == false )
    {
      await exports.addRole(uID, "Educator", courseId);
    }


  }
}



//Update Admin details
exports.updateAdmin = async(req, res) => {
  // if(req.body.details.active == "True")
  // {
  //   req.body.details.active = true;
  // }
  // else {
  //   req.body.details.active = false;
  // }

  await User.findOne({
    where : {email : req.body.details.oldemail}
  }).then(async(data) => {
      data.update({
        firstName : req.body.details.firstname,
        lastName : req.body.details.lastname,
        upNumber : req.body.details.upnumber,
        email : req.body.details.email,
        active : req.body.details.active
      })
  })

}

exports.educatorBarGraph = async(req, res) => {

  var semMark = 0;
  var courseCode = [];
  var mark = [];
  var semAverage = [];
  var upNumber = [];
  var obj = new Object;
      
  // console.log("---------------------");
  // console.log(req.body.details.sNumber);
  // console.log(req.body.details.courses);

  for(var i = 0; i < req.body.details.courses.length; i++)
  {
    console.log(req.body.details.courses[i].courseID);

      await Course.findOne({
        where: {id: req.body.details.courses[i].courseID}
    }).then( async course => {
  
        var roles = await course.getRole({
            include:['User'],
            where: {roleType: 'Student'},
         });
         for(var j = 0; j < roles.length; j++)
         {
           upNumber.push(roles[j].dataValues.User.upNumber)
         }
        // console.log(upNumber);
      })

      console.log(upNumber);

      for(var k = 0; k < upNumber.length; k++)
      {
        await Marks.findAll({
          where : {
              courseId : req.body.details.courses[i].courseID,
              studentNumber : upNumber[k]
          }
            }).then(async(data) => {

              semMark = 0;
              for(var j = 0; j < data.length; j++){

                semMark = semMark + ((data[j].dataValues.mark / data[j].dataValues.totalMark)* data[j].dataValues.perWeight);

              }
              semAverage.push(semMark)
              

            })
        
      }

      // console.log(semAverage);
      var total = 0;
      for(var j = 0; j < semAverage.length; j++) {
          total += semAverage[j];
      }
      var avg = total / semAverage.length;

      console.log(avg);

      // console.log(req.body.details.courses[i]);
      courseCode.push(req.body.details.courses[i].courseCode);
      mark.push(avg);
      // console.log(mark);
      // console.log(courseCode);
  
    // })

  }

  obj['courseCode'] = courseCode;
  obj['mark'] = mark;
  console.log(obj.courseCode);
  console.log(obj.mark);

  res.status(200).json(obj);

}

exports.studentBarGraph = async(req, res) => {

  var semMark = 0;
  var courseCode = [];
  var mark = [];
  var obj = new Object;
      
  // console.log("---------------------");
  // console.log(req.body.details.sNumber);
  // console.log(req.body.details.courses);

  for(var i = 0; i < req.body.details.courses.length; i++)
  {
    console.log(req.body.details.courses[i].courseID);
    await Marks.findAll({
      where : {
        studentNumber : req.body.details.sNumber,
        courseId : req.body.details.courses[i].courseID
      }
    }).then(async(data) => {
  
      console.log(data);
      for(var j = 0; j < data.length; j++)
      {
        semMark = semMark + ((data[j].dataValues.mark / data[j].dataValues.totalMark)* data[j].dataValues.perWeight);
      }

      courseCode.push(req.body.details.courses[i].courseCode);
      mark.push(semMark);
      // console.log(mark);
      // console.log(courseCode);
  
    })

  }

  obj['courseCode'] = courseCode;
  obj['mark'] = mark;
  // console.log(obj.courseCode);
  // console.log(obj.mark);

  res.status(200).json(obj);


  
}

exports.getMarks = async(req,res) => {

  var obj = [];
  console.log(req.body.details.course);
  console.log(req.body.details.email);
  var moduleId = await exports.getModuleID(req.body.details.course);
  var courseId = await exports.getCourseID(moduleId);

  var studentNumber;
  var courseId;
  await User.findOne({
    where : {
      email : req.body.details.email
    }
  }).then(async(data) => {
    studentNumber = data.dataValues.upNumber;
  })
  

  console.log(studentNumber);
  console.log(courseId);

  await Marks.findAll({
    where : {
      studentNumber : studentNumber,
      courseId : courseId
    }
  }).then(async(data) => {
    console.log(data);
    for(var i = 0; i < data.length; i++)
    {
      // var name = await helper.getListOfAllEducatorAssessments([data[i].dataValues.assessmentId]);
      var name = await helper.getAssessmentNameAndType([data[i].dataValues.assessmentId]);
      obj.push({
        assessment : name,
        mark : data[i].dataValues.mark,
        totalMark : data[i].dataValues.totalMark,
        weight : data[i].dataValues.perWeight
      })
    }

    res.status(200).json(obj);
  })
}

exports.token = async (req,res) => {

  console.log(req.body.params.user);
  var userEmail = req.body.params.user.toString();
  userEmail = userEmail.toLowerCase();

  await User.findOne({
    where : {
      email : userEmail
    }
  }).then(async(data) => {
      var jwt = nJwt.create({ id: data.id }, jwtConfig.secret);
      jwt.setExpiration(new Date().getTime() + (24*60*60*1000));

    res.status(200).send({ auth: true, token: jwt.compact() });
    });

}

exports.addAssessmentType = async (req, res) => {

  console.log(req.body.details);

  await AssessmentType.create({
    assessmentType: req.body.details.type,
    active: req.body.details.active
  }).then(async(data) => {
    
    res.status(200).json(data);
  })

}

exports.displayAssessment = async (req, res) => {

  console.log("----------here---------------");


  await AssessmentType.findAll({
    attributes : ["id", "assessmentType", "active"]
  }).then(async(data) => {

    // console.log("here");

    console.log(data);
    var obj = [];
    for(var i = 0; i < data.length; i++)
    {
      obj.push(data[i].dataValues);
      // console.log(data[i].dataValues);
    }

    console.log(obj);
    res.status(200).json(obj);
  })

}

//Update Assessment
exports.updateAssessment = async(req, res) => {

  await AssessmentType.findOne({
    where : {assessmentType : req.body.details.type}
  }).then(async(data) => {
      data.update({
        active : req.body.details.active
      })
      res.status(200);
  })
}