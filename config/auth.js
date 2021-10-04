const nJwt = require('njwt');
var config = require('./jwtConfig');

function jwtAuth(req, res, next) {
  if (!req.token) {
    console.log("No token provided");
    return res.status(403).send({ auth: false, message: 'No token provided' });
  }

  nJwt.verify(req.token, config.secret, function(err, decoded) {
    if (err) {
      console.log("Could not authenticate token");
      return res.status(500).send({ auth: false, message: 'Could not authenticate token' });
    }
    console.log("Success");
    req.userId = decoded.body.id;
    next();
  });
}

module.exports = jwtAuth;