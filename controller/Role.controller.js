const db = require("../models");
const Role = db.Role;
const Course =db.Course;

/**
 * This file contains controller functions related to the role model functions.
 * @file
 */

/**
 * This function adds a relationship to the roleCourse table.
 * @param {string} roleID - roleID input from role table.
 * @param {string} courseID - courseID input from course table.
 */
exports.assignRoleCourse = async (roleID,courseID) =>{
    console.log('Entered assignRoleCourse function')
    console.log('roleID = ',roleID,' and CourseID = ',courseID)
    try {
        Role.findOne({ where: {id:parseInt(roleID)} }).then(async(role)  =>{
            console.log(role)
            try {
                Course.findOne({where: {id: parseInt(courseID)}}).then(async(course)  =>{
                    console.log(course)
                    role.addCourse([course]);
                });  
            } catch (error) {
                console.log(error)
            }
             
          });
    } catch (error) {
        console.log(error)
    }
   
    }


/**
 * This function returns an object consisiting of details of all users that are educators for a particular
 * courseID
 * @param {Integer} courseID 
 */
    exports.findAllEducatorsForCourseID = async (courseID) => {
        
        var finalObj;
console.log('Entered findAlleducators fora courseID with courseID = ', courseID);

        await Course.findOne({
            where: {id: parseInt(courseID)}
        }).then( async course => {
           // console.log('found course with info : ',course);
            var roles = await course.getRole({
                include:['User'],
                where: {roleType: 'Educator'},
             });
            finalObj = await exports.extractEducatorDetailsFromRoleObj(roles);
            //console.log('final obj = ',finalObj)
            return finalObj;
    })
    return finalObj;
}

exports.extractEducatorDetailsFromRoleObj = async (roleObj) => {
    var educatorObj = []
    return new Promise( async (resolve,reject) => {
        var promises = roleObj.map( async function (educator){
            var obj = {};
            // console.log('educator iter',educator);
            //console.log('Specific vales : ', educator.dataValues.User.dataValues)
            var userObj = educator.dataValues.User.dataValues;
            obj['fullName'] = userObj.firstName + ' ' + userObj.lastName;
            obj['email']= userObj.email ;
            obj['upNumber'] = userObj.upNumber;
            return obj;
        })
    
        await Promise.all(promises).then(function (obj){
           // console.log('Object has : ',obj)    
             resolve(obj);
       })
    })
    
}