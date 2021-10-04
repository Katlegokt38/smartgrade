const user = require('../../controller/User.controller');
const { Assessment, User } = require("../../models");
const db = require("../../models");
var request = require('supertest');
var app = require('../../server');
const { expect } = require('chai');

// COMMENTED OUT FOR TRAVIS ATM
// describe('gets a users details',async () => {
//   // Integration test
//   it('returns an object with list of courses and roles of a user', function(done){
//      request(app).get('/api/user/getUserDetails?user=tuksexp1@gmail.com')
//      .set('Accept', 'application/json')
//      .expect('Content-Type', /json/)
//      .expect(200).end(function(err,res){
//       //console.log(res.body);
//       expect(res.body).to.be.an('object')
//       done();
//     });
//  });

 // Integration test
//  it('gives a server error because of no user found', function(done){
//   request(app).get('/api/user/getUserDetails?user=noUser@gmail.com')
//   .set('Accept', 'application/json')
//   .expect('Content-Type', /json/)
//   .expect(500).end(function(err,res){
//    //console.log(res.body);
//    expect(res.body.message).equal("Retrieving user details Error!");

//    done();
//    });
//   });
// });


//User Integrstion test
describe('Add User test',async () => {
  it('Add new Educator to the database', function(done){

    var req =
      {
      "details": {
         "firstname" : "Katlego",
         "lastname" : "Sekgethela",
         "upnumber" : "16329784",
         "email" : "u16329784@tuks.co.za",
         "active" : true,
         "courses" : ['COS301'],
         "role" : "Educator"
      }


    }; //test object

     request(app).post('/api/user/addUser')
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .send(req)
     .expect(200).end(function(err,res){
      console.log(res.body);
      done();
    });
  });

  it('Add new Admin to the database', function(done){

    var req =
      {
      "details": {
         "firstname" : "Tuks",
         "lastname" : "Exp",
         "upnumber" : "12345678",
         "email" : "tuksexp1@gmail.com",
         "active" : true,
         "role" : "Admin"
      }


    }; //test object

     request(app).post('/api/user/addUser')
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .send(req)
     .expect(200).end(function(err,res){
      console.log(res.body);
      done();
    });
  });
});

// COMMENTED OUT FOR TRAVIS ATM
//describe('Get and display user info test',async () => {
  // it('Retrieve Educator info from database', function(done){

  //   var req =
  //     {
  //     "details": {
  //        "role" : "Educator"
  //     }

  //   }; //test object

  //    request(app).post('/api/user/displayUserInformation')
  //    .set('Accept', 'application/json')
  //    .expect('Content-Type', /json/)
  //    .send(req)
  //    .expect(200).end(function(err,res){
  //     console.log(res.body);
  //     done();
  //   });
  // });

//   it('Retrieve admin info from database', function(done){

//     var req =
//       {
//       "details": {
//          "role" : "Admin"
//       }
//     }; //test object

//      request(app).post('/api/user/getAdminUsers')
//      .set('Accept', 'application/json')
//      .expect('Content-Type', /json/)
//      .send(req)
//      .expect(200).end(function(err,res){
//       console.log(res.body);
//       done();
//     });
//   });
// });


describe('Update user info test',async () => {
  it('Update Educator info in database', function(done){

    var req =
      {
      "details": {
         "firstname" : "Katlego",
         "lastname" : "Sekgethela",
         "upnumber" : "16329784",
         "email" : "u16329784@tuks.co.za",
         "active" : false,
         "course" : ["COS301", "COS332"],
         "role" : "Educator",
         "oldemail" : "u16329784@tuks.co.za"
      }

    }; //test object

     request(app).post('/api/user/updateEducator')
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .send(req)
     .expect(200).end(function(err,res){
      // console.log(res.body);
      done();
    });
  });

  it('Update admin info in database', function(done){

    var req =
      {
      "details": {
        "firstname" : "Tuks",
        "lastname" : "Exp1",
        "upnumber" : "12345678",
        "email" : "tuksexp1@gmail.com",
        "active" : false,
      }
    }; //test object

     request(app).post('/api/user/updateAdmin')
     .set('Accept', 'application/json')
     .expect('Content-Type', /json/)
     .send(req)
     .expect(200).end(function(err,res){
      // console.log(res.body);
      done();
    });
  });
});

//Integration testing for marks - COMMENTED OUT FOR TRAVIS ATM
// describe('Get and display student marks test',async () => {
//   it('Display student marks', function(done){

//     var req =
//       {
//       "details": {
//          "course" : "COS326",
//          "email" : "u16091486@tuks.co.za"
//       }


//     }; //test object

//      request(app).post('/api/user/getMarks')
//      .set('Accept', 'application/json')
//      .expect('Content-Type', /json/)
//      .send(req)
//      .expect(200).end(function(err,res){
//       console.log(res.body);
//       done();
//     });
//   });
// });

/*
// Integration test, doesnt exist this function 
describe("gets a list of all educators",async () => {
  it('returns an object with list educators and their details', function (done){
    request(app).get('/api/user/getEducatorUsers')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200).end(function(err,res){
        console.log('educator object :', res.body);
        expect(res.body).to.be.not.empty;

        done();

      })
    });

});
*/


/*
   router.post("/addUser", User.addUser);
    router.get("/getCourseList", User.getCourseList);
    router.get("/getAllUsers", User.getEducatorUsers);
    router.post("/addModule", User.addModule);
    router.post("/addCourse", User.addCourse);
*/
