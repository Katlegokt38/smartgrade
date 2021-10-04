const educator = require('../../controller/Educator.controller');
const db = require("../../models");
const Assessment = db.Assessment;
const User = db.User;
const Role = db.Role;
const Course = db.Course;
const Module = db.Module;

var request = require('supertest');
var app = require('../../server');
const { expect } = require('chai');
const chai = require('chai');
chai.use(require('chai-as-promised'));


//Unit Test
 describe('Get the list of assessment Types',async () => {

  it('retrieves array of assessment types', () => {
         var list = Assessment.rawAttributes.assessmentType.values
         console.log(list);
         expect(list).to.not.be.null;
         expect(list).to.be.an('array')
     });

 });

 //Unit Test - COMMENTED OUT FOR TRAVIS ATM
//  describe('Test the assessment retrieval functions', async () => {
//     it('Get the list of all assessments for specified courses', async () => {
//       courseIDArray = [1,2,3];  // Mock object with course IDs
//       var assessmentData = await educator.getListOfAllEducatorAssessments(courseIDArray).then(res=>res);
//       console.log(assessmentData);
//       expect(assessmentData).to.be.an('array').that.is.not.empty;
//     })

//     it('should indicate error and throw exception when empty array passed as parameter', async () => {
//       courseIDArray = [];
//       await expect(educator.getListOfAllEducatorAssessments(courseIDArray)).to.be.rejectedWith(Error);
//     })

//     it('should return empty array for given course with no assessments', async () => {
//       courseIDArray= [900]; // mock array with course that has no assessments
//       var assessmentData = await educator.getListOfAllEducatorAssessments(courseIDArray);
//       expect(assessmentData).to.be.an('array').that.is.empty;
//     })
//  })



// COMMENTED OUT FOR TRAVIS ATM
// describe('updates an assessment to be active or inactive',async () => {
//   // Integration test
//   it('should toggle the boolean field ', function(done) {

//     var req =
//       {
//         details: {
//           courseCode: 'COS326',
//           courseID: 3,
//           assessmentID: 1,
//           assessmentType: 'Practical',
//           assessmentName: 'p1',
//           weight: '5',
//           active: 'false'
//         }
//     }; // mock test object

//      request(app).post('/api/educator/updateAssessmentActive')
//      .set('Accept', 'application/json')
//      .expect('Content-Type', /json/)
//      .send(req)
//      .expect(200).end(function(err,res){
//        console.log(res.body);
//        expect(res.body.status).to.equal('success');
//        done();
//      });


//  });

 // Integration test
//  it('should give error request not complete because of unsuccessful toggle ', function(done) {

//   var req =
//     {
//       details: {
//         courseCode: 'COS301',
//         courseID: 1,
//         assessmentID: 999,
//         assessmentType: 'Demo',
//         assessmentName: 'Demo 4',
//         weight: '5',
//         active: 'false'
//       }
//   }; //test object

//    request(app).post('/api/educator//updateAssessmentActive')
//    .set('Accept', 'application/json')
//    .expect('Content-Type', /json/)
//    .send(req)
//    .expect(400).end(function(err,res){
//      console.log(res.body);
//      expect(res.body.message).to.equal('Request not complete');
//      done();
//    });


// });

// // Unit test
// it('should throw an exception due to incomplete parameters', async () =>{
    
//       await expect(educator.changeAssessmentActiveStatus(null,null)).to.be.rejectedWith(Error);
// })


// //Unit test
// it('should return true after changing status', async () =>{
//     aID = 1;
//     status = true;
//     var val = await educator.changeAssessmentActiveStatus(aID,status)
//     expect(val).to.be.equal(true);
// })

// //Unit test
// it('should return false as no update has been made', async() =>{
//   aID = 999;
//   status = false;
//   var val = await educator.changeAssessmentActiveStatus(aID,status)
//   expect(val).to.be.equal(false);
// })
// })


// Integration test - COMMENTED OUT FOR TRAVIS ATM
// describe('Get Student Info',async () => {
//   it('Retrive student information', function(done) {

//     var req =
//     {
//       "details": {
//          "course" : "COS301",
//       }
//     };//test object

//      request(app).post('/api/educator/getStudentInfo')
//      .set('Accept', 'application/json')
//      .expect('Content-Type', /json/)
//      .send(req)
//     //  .expect(200).end(done);
//      .expect(200).end(function(err,res){
//       console.log(res.body);
//       done();


//  });
// });

// // Integration test
// it('Retrive student marks', function(done) {

//   var req =
//   {
//     "details": {
//        "course" : "COS301",
//     }
//   };//test object

//    request(app).post('/api/educator/getStudentMark')
//    .set('Accept', 'application/json')
//    .expect('Content-Type', /json/)
//    .send(req)
//   //  .expect(200).end(done);
//    .expect(200).end(function(err,res){
//     console.log(res.body);
//     done();


//   });
// });

// // Integration test
// it('Returns status 400 with incomplete undefined request', function(done) {
//   var req =
//   {
//     "details": {
//        "course" : undefined,
//     }
//   };//test object

//    request(app).post('/api/educator/getStudentInfo')
//    .set('Accept', 'application/json')
//    .expect('Content-Type', /json/)
//    .send(req)
//   //  .expect(200).end(done);
//    .expect(400).end(function(err,res){
//     console.log(res.body);
//     done();
//   });
// });


// // Unit test
// it('should throw error on invalid courseID parameter', async() => {

//   await expect(educator.getStudentsInfoFromCourseID(null)).to.be.rejectedWith(Error);
// })

// // Unit test
// it( 'should return array of student objects', async() => {

//   var sObj = await educator.getStudentsInfoFromCourseID(1);
//   expect(sObj).to.be.an('array').that.is.not.empty;
// })
// })

describe('Update Student Info',async () => {
  it('Update the student marks in the database', function(done) {

    var req =
  {
    "details": {
      "sNumber" : "u45556485",
      "mark" : 20,
      "assessment" : 1
    }
  };//test object


   request(app).post('/api/educator/updateMarks')
   .set('Accept', 'application/json')
   .expect('Content-Type', /json/)
   .send(req)
  //  .expect(200).end(done);
   .expect(200).end(function(err,res){
    console.log(res.body);
    done();

  })
})

it('Set student active to true or false', function(done) {

  var req =
{
  "details": {
    "active" : false,
    "oldemail" : "katlegosekgethela@gmail.com",
  }
};//test object


 request(app).post('/api/educator/updateStudent')
 .set('Accept', 'application/json')
 .expect('Content-Type', /json/)
 .send(req)
//  .expect(200).end(done);
 .expect(200).end(function(err,res){
  console.log(res.body);
  done();

})
})
  

});
