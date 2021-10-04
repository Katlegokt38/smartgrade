const { Marks } = require("../models");
const { getCourseIDFromModuleName } = require("./Course.controller");


/**
 * Adds a list of marks to the marks database
 * @param inputMarks - list of marks from the marksheet
 * @function
 */
exports.addMarks = async (courseID,assessmentID,marks,weighting,maxMarks) =>{
   // console.log(courseID,assessmentID,marks,weighting,maxMarks)
    var markArr = [];
    marks.forEach(elem => {
        var markObj = new Object;
        markObj['studentNumber'] = elem.Student;
        markObj['courseId'] = courseID;
        markObj['assessmentId'] = assessmentID;
        markObj['mark'] = parseInt(elem.Mark);  //TODO: parseInt because editing makes string on client, so fix on client side rather
        markObj['totalMark'] = parseFloat(maxMarks);
        markObj['perWeight'] = parseFloat(weighting);
        markArr.push(markObj);
    });
    try {
        await Marks.bulkCreate(markArr).then((res) =>{
            //console.log(res);
            return res;
        });
        } catch (error) {
         console.log(error)
         throw error
    }
}