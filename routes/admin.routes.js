const Admin = require('../controller/Admin.controller.js'); //Educator functions
var router = require("express").Router();
const validator = require("../middleware/validator");

router.get('/getCount',Admin.getCount)
// router.post('/getCSV', Admin.getCSV)
module.exports = router;
