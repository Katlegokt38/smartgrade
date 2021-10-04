var model = require ('../models/Notification.model.js');
var mongoose = require("mongoose").set('debug', true);;
const Notification = require('./Notification.controller')
const Course = require('./Course.controller')
var Schema = mongoose.Schema;
const db = require("../models");
const Role = require('./Role.controller')



/**
 * This function returns all the feedback threads of this student user.
 * @param {Object} req - request recieved from client  
 * @param {Object} res - response to be sent back to client
 */
exports.getAllFeedback = async (req,res) =>{
    console.log('Entered Student get All feedback with req = ',req.body);
    var studentObj = req.body.details;
    var user = await Notification.findOrCreateUser(studentObj);
    await model.Thread.find({
        recipients: user.doc._id,
        type:'Feedback'
    }).populate('threadStarter').exec().then(response => {
            console.log('found all threads with recipeient : ', response)
        res.status(200).json(response);
        
    })

    }



/**
 * This function returns all the dispute threads of this student user.
 * @param {Object} req - request recieved from client  
 * @param {Object} res - response to be sent back to client
 */
exports.getAllDispute= async (req,res) =>{
    console.log('Entered Student get All dispute with req = ',req.body);
    
    var studentObj = req.body.details;
    var user = await Notification.findOrCreateUser(studentObj);
    await model.Thread.find({
        threadStarter: user.doc._id,
        type:'Dispute'
    }).populate('recipients').exec().then(response => {
            console.log('found all threads with recipeient : ', response)
        res.status(200).json(response);
        
    })
    }



/**
 * This function adds a students reply to a thread
 * @param {Object} req - request recieved from client  
 * @param {Object} res - response to be sent back to client
 */
exports.addMessageToThread= async (req,res) =>{
    console.log('Entered Student add message t0 thread with req = ',req.body);
    // get input data
    var message = req.body.details.newReplyDescription;
    var senderObj = await Notification.findOrCreateUser(req.body.details.student);
    var inputData = new Object;
    
    inputData['message'] = message;
    inputData['sender'] = senderObj._id;
    inputData['threadType'] = req.body.details.type;
    inputData['assessmentName'] = req.body.details.assessmentName;
    inputData['assessmentType'] = req.body.details.assessmentType;
    inputData['subject'] = req.body.details.subject;
    console.log('after append input : ', inputData)
    var newNotif = await Notification.createNewNotification(inputData.message,senderObj);
    model.Thread.findOne(
        {
            subject:inputData.subject,
            type: inputData.threadType,
            assessmentName : inputData.assessmentName,
            assessmentType : inputData.assessmentType,
            // read array of senderObj 
        }).then(thread => {
            console.log(' found thread with details : ', thread);
            thread.messages.push(newNotif);
            thread.save();
            res.status(200).json({status:true});
        })
    
}
    



/**
 * This function returns all messaged of a single thread
 * @param {Object} req - request recieved from client  
 * @param {Object} res - response to be sent back to client
 */
exports.getThreadHistory = async (req,res) => {
    console.log(' Entered get student thread history with req = ', req.body)
    inputObj = req.body.details.threadDetails;
    var messageHistory = new Array;
    await model.Thread.findOne({
            subject: inputObj.subject,
            type: inputObj.type,
            assessmentName : inputObj.assessmentName,
            assessmentType : inputObj.assessmentType
    }).populate('threadStarter').populate('recipients').populate('messages').exec().then(async (results,err) => {
           console.log('all history found thread => ',results);
           var msgArr =  results.messages;
           msgArr.forEach((elem,index,array) => {
               console.log('This is a message : ', elem);
               model.Notification.findById(elem._id).populate('sender').populate('read').exec().then( msgDet => {
                   messageHistory.push(msgDet);
                   if(index === array.length -1){
                    console.log('last msg processed');
                    res.status(200).json(messageHistory)
                }
               });
             
           });
           console.log(' If Error thread not found error => ',err)
        
        });      
}

/**
 * This function adds a new dispute 
 * @param {Object} req - request recieved from client  
 * @param {Object} res - response to be sent back to client
 */
exports.addNewDispute = async (req,res) => {
    console.log(' Entered add new dispute with req = ', req.body)

    var inputObj = req.body.details;
    var studentObj = inputObj.student;
    var disputeTitle = inputObj.title;
    var course = inputObj.course;
    var assessmentName = inputObj.assessment.assessmentName;
    var assessmentType = inputObj.assessment.assessmentType;
    var disputeDescription = inputObj.description;

    var studentObject = await Notification.findOrCreateUser(studentObj); 

   // var recArray = [];
    //recArray.push(studentObject.doc._id);

    var recArray = await exports.getAllEducatorsForACourse(course); // TOD): different years? 
    console.log('in main fn : ',recArray)
    
    var newThread = await Notification.createThread(studentObject,'Dispute',disputeTitle,recArray, course, assessmentName, assessmentType)
   
    if(newThread == -1 )
    {
        console.log(' this is duplicate dispute with same title. ')
        res.status(400).json({status:false, message : 'Dispute for same assessment for student already exists'})
    }
    else{
        var newNotif = await Notification.createNewNotification(disputeDescription,studentObject);
        newThread.messages.push(newNotif);
        newThread.save();
        console.log(newThread);
        res.status(200).json(newThread);
    }
    
}

/**
 * This function returns an array of User objects from mongo collection.
 * First the module name gets the course ID
 * Course ID checked for in the role Course table. For each 
 * role ID == educator push educator UPNumber, fullName and email
 * Then iterate on each educator by calling findOrCreateUser(obj) to get array of mongo_ids 
 * return this 
 * @param {*} course 
 */
exports.getAllEducatorsForACourse = async (course) => {
    var educatorObjIds = [];
    console.log('entered getAllEducatorsFOrAcourse with course : ', course);
    // for each educator get from User mongoDB table. 
    var courseID = await Course.getCourseIDFromModuleName(course);
    console.log(courseID);
    var educatorArr = await Role.findAllEducatorsForCourseID(courseID).then(res=>res);
    console.log('educator array in helper in student controller = ', educatorArr)
    return new Promise( async (resolve,reject) => {
        var promises = educatorArr.map( async function (educator){
            var edObj = await Notification.findOrCreateUser(educator);
            return edObj.doc._id;
        })
    
        await Promise.all(promises).then(function (obj){
            console.log(' array ObjectID has : ',obj)    
             resolve(obj);
       })
    })
    
}