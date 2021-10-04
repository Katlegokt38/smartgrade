const db = require("../models");
const User = db.User;
const Note = db.Note;


// Integration test function 
exports.addNoteReq = async (req,res) => {
    console.log('recieved server req on add note req with req : ', req.body )
    // perform validation on req, return error else
    // validate on duplicate note, same everything 
    //validate on null values
    var course = req.body.inputDetails.course;
    var educatorName = req.body.inputDetails.educator.name;
    var noteDescription = req.body.inputDetails.noteDescription;
    User.findOne({
        where: {upNumber : req.body.inputDetails.upNumber}
    }).then( async student  => {
        console.log(student);
       // if(student) 
            var note = await exports.addUserNote(student, course,educatorName, noteDescription)
            if (note) { // if success added notes
                console.log(note);
                res.status(200).json({status:true, result: 'successfuly added note'})
            }
            else{
                res.status(401).json({status:false, result: 'failure to add note'})
            }
        
        //else{
        //    res.status(401).json({status:false, result: 'student not found in user table'})
       // }
    })

   // res.status(400).json({status: false, result : 'validation error : '})
}


// Unit test function 
exports.addUserNote = async (student,course,educator,note) => {
    console.log(' Entered add usernote with parameters : ',student,course,educator,note)
    var result = {};
    Note.create({
        course : course,
        educator : educator,
        noteDescription : note
    }).then( note => {
        console.log(note)
        student.addNote(    // set only does one the whole time
          [note]
        ).then(res => {
        console.log(res)
        result = res
        })
       
    })
 
   return result;
}


exports.getNoteReq = async (req,res) => {
    console.log('Recieved req in getNoteReq with req: ', req.body);
    // perform validation on req
    
    User.findOne({
        where: {upNumber : req.body.inputDetails.upNumber},
    }).then(student => {
        student.getNote().then( response => {
            console.log(response);
            res.status(200).json({status:true, response:response})
        })
        
    })
    
}