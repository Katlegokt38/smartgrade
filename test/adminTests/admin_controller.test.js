const user = require('../../controller/User.controller');
const { Module, User } = require("../../models");
const db = require("../../models");
var request = require('supertest');
var app = require('../../server');
const { expect } = require('chai');

describe('Module system',async () => {
    // Integration test
    it('add a module to the database', function(done){

        var req =
      {
        "details": {
            "modCode" : "COS212",
            "modName" : "Data Structures",
            "active" : true
          }

    };

       request(app).get('/api/user/addModule')
       .set('Accept', 'application/json')
       .expect('Content-Type', /json/)
       .expect(200).end(function(err,res){
        console.log(res.body);
        expect(res.body).to.be.an('object')
        done();
      });
   });


   it('update module details', function(done){

    var req =
  {
    "details": {
        "modCode" : "COS212",
        "modName" : "Data Structures",
        "active" : true,
        "oldmodCode" : "COS212"
      }

};

   request(app).get('/api/user/updateModule')
   .set('Accept', 'application/json')
   .expect('Content-Type', /json/)
   .expect(200).end(function(err,res){
    console.log(res.body);
    expect(res.body).to.be.an('object')
    done();
  });
});

// it('display module information', function(done){

//    request(app).get('/api/user/displayModule')
//    .set('Accept', 'application/json')
//    .expect('Content-Type', /json/)
//    .expect(200).end(function(err,res){
//     console.log(res.body);
//     expect(res.body).to.be.an('object')
//     done();
//   });
// });
});

describe('Course system',async () => {
    // Integration test
    it('add a course to the database', function(done){

        var req =
      {
        "details": {
            "year" : 2020,
            "ModuleId" : 2,
            "active" : true
          }

    };

       request(app).get('/api/user/addCourse')
       .set('Accept', 'application/json')
       .expect('Content-Type', /json/)
       .expect(200).end(function(err,res){
        console.log(res.body);
        expect(res.body).to.be.an('object')
        done();
      });
   });

   it('display course from database', function(done){

    var req =
    {
      "details": {
          "modCode" : "COS332",
          "active" : true,
          "year" : 2020
        }

  };

   request(app).get('/api/user/updateCourse')
   .set('Accept', 'application/json')
   .expect('Content-Type', /json/)
   .expect(200).end(function(err,res){
    console.log(res.body);
    expect(res.body).to.be.an('object')
    done();
  });
});

});

describe('CSV system',async () => {
    // Integration test
    it('download csv extract', function(done){

        var req =
      {
        "details": {
            "type" : "Users",
          }

    };

       request(app).get('/api/user/download')
       .set('Accept', 'application/json')
       .expect('Content-Type', /json/)
       .expect(200).end(function(err,res){
        console.log(res.body);
        expect(res.body).to.be.an('object')
        done();
      });
   });

});