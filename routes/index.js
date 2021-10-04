const express = require('express');
const educatorRoutes = require('./educator.routes');
const userRoutes = require('./user.routes.js');
const adminRoutes = require('./admin.routes.js')
const notificationRoutes = require ('./notification.routes.js')
const studentRoutes = require('./student.routes')

module.exports = function(app) {
  
  app.use("/api/user", userRoutes);
  app.use("/api/educator", educatorRoutes);
  app.use("/api/admin",adminRoutes)
  app.use("/api/notification", notificationRoutes)
  app.use("/api/student",studentRoutes)
  
}
