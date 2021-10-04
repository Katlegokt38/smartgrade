var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')




var NotificationSchema = new Schema({
    message : String,
    sender: { type : Schema.Types.ObjectId, ref: 'User'},
    date : { type : Date, default : Date.now()},
    read : [{ type : Schema.Types.ObjectId, ref:'User' }], // to identify if read their id must appear here else unread
    nextMessage : { type: Schema.Types.ObjectId, ref: 'Notification' }    //reference to next OID of notification
});





var ThreadSchema = new mongoose.Schema({
    threadStarter : { type : Schema.Types.ObjectId, ref: 'User'},
    recipients : [ {type : Schema.Types.ObjectId, ref: 'User'}],   // left it as array in case we want to sahre with multiple users, []
    messages: [{ type: Schema.Types.ObjectId, ref: 'Notification' }] ,
    course: String,
    assessmentName : String,
    assessmentType : String,
    date : { type : Date, default : Date.now()},
    status: Boolean,    // resolved or not
    type: String,
    subject : String    // No need to have seperate schema for this
});


var UserSchema = new Schema({
    userID: String,
    fullName : String,
    email : String
   // inboxThread :  [{ type: Schema.Types.ObjectId, ref: 'Thread' } ] // -> No use found as yet. 
}); 

// add plugin
UserSchema.plugin(findOrCreate);
ThreadSchema.plugin(findOrCreate);
NotificationSchema.plugin(findOrCreate);

var models = {
    Notification : mongoose.model('Notification', NotificationSchema),
    User : mongoose.model('User', UserSchema),
    Thread : mongoose.model('Thread', ThreadSchema)
  };
  

module.exports = models;