const { check } = require('express-validator/check');

//  request validations for the add module function
exports.addModule = [
  check('details.modCode').isLength({max:6}),
  check('details.active').isLength({max:5}),
  check('details.modName').isString().isLength({max:25})
];

// maybe change educator get assessment function name
exports.getAssessments = [
  // note how * gets you the array iteration, i.e courses[0].courseCode,courses[1]...
  check('courses.*.courseCode').isString().isLength({max:6}),
  check('courses.*.courseID').isInt(),
];




