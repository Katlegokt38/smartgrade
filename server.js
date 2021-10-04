const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
var Promise = require("bluebird");
var bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
//var router = require('./routers/router.js');
const cors = require('cors');
var mongoose = require('mongoose');


var app = express();
var port = process.env.PORT || 8080;
const db = require('./models')
db.sequelize.sync();

const corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bearerToken());

app.use(express.static(path.join(__dirname+"/dist/"))); // for use in heroku 
app.get('/login/callback', function(req, res) {
  res.sendFile(__dirname+'/dist/');
});

//app.use('/', router);
require("./routes/index")(app);

// Create Server
  app.listen(port, () => {
  console.log('Server listening on the port::'+ port);
});

//TEST

//Set up default mongoose connection
// var mongoAddress = 'mongodb://127.0.0.1/local';  //local host conn
var mongoAddress = 'mongodb+srv://admin:admin@cluster1.xz3lp.mongodb.net/smartgrade?retryWrites=true&w=majority';
mongoose.connect(mongoAddress, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//Get the default connection
var mongoDB = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports =app;
