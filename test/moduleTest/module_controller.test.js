const user = require('../../controller/User.controller');
const { Module, User } = require("../../models");
const db = require("../../models");
var request = require('supertest');
var app = require('../../server');
const { expect } = require('chai');

describe('Add module',async () => {
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
        //console.log(res.body);
        expect(res.body).to.be.an('object')
        done();
      });
   });
});