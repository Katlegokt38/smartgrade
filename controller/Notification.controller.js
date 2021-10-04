var model = require ('../models/Notification.model.js');
var mongoose = require("mongoose").set('debug', true);;
var Schema = mongoose.Schema;




/**
 * This API function call adds a new student feedback for a particular student 
 * @param {*} req - req object containing details about the student and course, assessment and educator creating the feedback
 * @param {*} res - res object responding back to client letting FE know that feedback adding was success or not.
 */
exports.addStudentFeedback = async (req,res) =>{
    console.log('entered add student feedback call with req : ', req.body);
    // do validations for empty strings/ invalid user etc 
    var studentObj = {};
    var educatorObj = {};
    var feedbackObject = [];
    // Student information
    var studentNumber = req.body.inputDetails.upNumber;
    var studentName = req.body.inputDetails.firstName + ' ' + req.body.inputDetails.lastName
    var studentEmail = req.body.inputDetails.email;

    // Educator information
    var  educatorObject = req.body.inputDetails.educator;  // consists of entire educator obj. including email and upnumber 
    
    // Thread information
    var course = req.body.inputDetails.course;
    var assessmentName = req.body.inputDetails.assessmentName;
    var assessmentType = req.body.inputDetails.assessmentType; 
    var studentSubjectLine = studentNumber + ' : ' + course + ' - ' + assessmentName ;  // TODO: change to take in as input instead of this
    var description = req.body.inputDetails.feedbackDescription;
    

    studentObj['upNumber']= studentNumber;
    studentObj['email']= studentEmail;
    studentObj['fullName']= studentName ;

    educatorObj['upNumber']= educatorObject.UPNumber ;
    educatorObj['email'] = educatorObject.email ;
    educatorObj['fullName'] = educatorObject.name ;

    var educatorObject = await exports.findOrCreateUser(educatorObj);
    var studentObject = await exports.findOrCreateUser(studentObj);  // student name and email
    console.log(educatorObject,studentObject)
    var recArray = [];
    recArray.push(studentObject.doc._id);
    var newThread = await exports.createThread(educatorObject,'Feedback',studentSubjectLine,recArray, course, assessmentName, assessmentType)
    console.log('in main newThread = ',newThread)
    // add initial notification to thread object 
    if(newThread == -1 )
    {
        console.log(' this is duplicate. How to handel? use a new subject line, multiple feedback for one assessment ?')
        res.status(400).json({status:false, message : 'Feedback for same assessment for student already exists'})
    }
    else{
        var newNotif = await exports.createNewNotification(description,educatorObject);
        newThread.messages.push(newNotif);
        newThread.save();
        console.log(newThread);
        res.status(200).json(newThread);
    }
  
}
/**
 *  Function to get time in SA timezone + 2 hours. Note if Javascript decides one day to implement their own addHours function
 *  it will break this. 
 * @param {int} h - hours to increase time by 
 */
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }
exports.createNewNotification = async (message,sender) =>{
    var notificationMsg;
    var currentDate = new Date().addHours(2);
    await model.Notification.create({
        message: message,
        sender:sender.doc._id,
        read:[sender.doc._id],
        date: currentDate
    }).then(notif => {
        notificationMsg = notif;
        console.log(notif)
    })
    return notificationMsg;
}

exports.createThread = async (initiator,type,subject,recipients,course,assessmentName,assessmentType) => {
    // if any of input is invalid stop here, check for duplicate? same subject 
    var threadObj;
   await model.Thread.findOne({
        threadStarter : initiator.doc._id,
        subject : subject,
        type: type
    }).then(async thr  => {
        console.log('thread found or not : ', thr)
        if(thr==null){
            var currentDate = new Date().addHours(2);
            console.log(initiator);
            console.log('Reciepients array ' , recipients);
           await model.Thread.create({
                threadStarter : initiator.doc._id,
                status: false,  // not applicable to feedback given to students 
                type: type,
                date: currentDate,
                course : course,
                assessmentName : assessmentName,
                assessmentType : assessmentType,
                subject : subject,
                recipients : recipients
            }).then( thread => {
                console.log('New Thread made : ', thread)
                threadObj = thread;
            })
        }
        else{
            console.log('FOUND THREAD EXISTS WITH SAME SUBJECT')
            threadObj = -1;
        }
    })
    
    return threadObj;
}

/**
 * This function finds a User and if not exist it creates a user. As input it takes an object
 * obj with fields upNumber, email and fullName
 * @param {Object} Obj 
 */
exports.findOrCreateUser = async (Obj)  => {
    console.log('Creating new User with Obj = ', Obj)
    var userObj;
    if(Obj.upNumber == null || Obj.upNumber == '')
    {
        throw Error('input paramter null or empty');
    }

    await model.User
.findOrCreate({
        userID : Obj.upNumber,
        email: Obj.email,
        fullName: Obj.fullName 
    }).then( async edu => {
        userObj = edu;    // mongo User ID 
    })
   
    return userObj;

}



exports.getAllStudentFeedback = async (req,res) => {
    console.log('Entered get All student feedback with req = ', req.body);
    var allFeedbackObj = new Array ;
    var educatorObj = req.body.details.educator;
    var educatorUser = await exports.findOrCreateUser(educatorObj)
    var feedbacks = await exports.getAllFeedbackFromEducator(educatorUser)    // check
  var promises = feedbacks.map( async function (feedback){
    console.log('feedback loop has : ',feedback)
    // for each thread we need date, student recipient name, course, assessment, subject title, resolved status and read array 
    // so far we have feedback.course , feedback.assessmentName, feedback.assessmentType, feedback.status, feedback.Type, feedback.subject, feedback.date  
    var obj = new Object;
    obj['course'] = feedback.course;
    obj['assessmentName'] = feedback.assessmentName;
    obj['assessmentType'] = feedback.assessmentType;
    obj['status'] = feedback.status;
    obj['type'] = feedback.type;
    obj['subject'] = feedback.subject;
    obj['date'] = feedback.date;
    var studentObj = await exports.getUserNameFromObject(feedback.recipients);  // this can be extended to have an array of student names. 
    obj['studentName'] = studentObj.fullName
    obj['studentEmail'] = studentObj.email;
    obj['studentUPNumber'] = studentObj.upNumber;
    
    
    return obj
   })
        Promise.all(promises).then(function (obj){
            console.log('Object has : ',obj)
            allFeedbackObj.push(obj);
        }).then(dat => {
            res.status(200).json(allFeedbackObj);
        })
            
        
    }
   
   


exports.getAllStudentDispute = async (req,res) => {
    console.log('Entered get All student dispute with req = ', req.body);
    var educatorObj = req.body.details.educator;
    var educatorUser = await exports.findOrCreateUser(educatorObj)
    var disputes = await exports.getAllDisputeToEducator(educatorUser)    // check
    disputes.forEach( dispute => {
        console.log(dispute)

    })
    res.status(200).json(disputes)
}

exports.getAllFeedbackFromEducator = async (educator) => {
    var fb;
    console.log('Entered get All feedback from educator with educator details : ', educator);
    await model.Thread.find({
        threadStarter: educator.doc._id
    }).then(result => {
        fb=result;
    })
    return fb;
}

exports.getAllDisputeToEducator = async (educator) => {
    var fb;
    console.log('Entered get All disputes from educator with educator details : ', educator);
    // get educator user first. 
    await model.Thread.find({
        type: 'Dispute',
        recipients : educator.doc._id
    }).populate('threadStarter').exec().then(result => {
        fb=result;
    })
    return fb;
}



exports.getUserNameFromObject = async (userObj) => {
    var userDetails = {};
    console.log(' Entered get User name from object with object = ',userObj );
await model.User.findOne({
    _id: userObj[0]
}).then( resUse => {
    userDetails['fullName'] = resUse.fullName ;
    userDetails['email'] = resUse.email ;
    userDetails['upNumber'] = resUse.userID;
})
console.log(userDetails);
return userDetails;
}



exports.getThreadHistory = async (req,res) => {

    console.log(' Entered get thread history with req = ', req.body)
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
           })
         
       })
       console.log(' If Error thread not found error => ',err)
       // iterate on the messages array and populate like below.
       // await model.Notification.findOne({_id: ntfid}).populate('sender').populate('read').exec(function(err,rest){
           // console.log('notification msg = ', rest,err)
        
    // });
    })

   
   
            
    
}


exports.addMessageToThread = async (req,res) => {
    console.log(' Entered add message to therad with req = ',req.body);
    // get input data
    var message = req.body.details.newReplyDescription;
    var senderObj = await exports.findOrCreateUser(req.body.details.educator);
    var inputData = new Object;
    
    inputData['message'] = message;
    inputData['sender'] = senderObj._id;
    inputData['threadType'] = req.body.details.type;
    inputData['assessmentName'] = req.body.details.assessmentName;
    inputData['assessmentType'] = req.body.details.assessmentType;
    inputData['subject'] = req.body.details.subject;
    console.log('after append input : ', inputData)
    var newNotif = await exports.createNewNotification(inputData.message,senderObj);
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


//

/**
 * This API function changes a threads status to the one passed along in the req object.
 * @param {*} req 
 * @param {*} res 
 */
exports.changeThreadStatus = async (req,res) =>{
    console.log('Entered change thread status with request : ', req.body);
    var threadID = req.body.details._id;
    model.Thread.findById(threadID).then(async thread => {
        console.log('Found thread to change status : ', thread)
        thread.status = req.body.details.newStatus
        thread.save();
        res.status(200).json({status:true,message:'success',data:thread})
    })
    // validation on request
}


