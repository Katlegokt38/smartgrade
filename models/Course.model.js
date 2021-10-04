
module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("Course", {
      year: {
        type: Sequelize.INTEGER,
      },
      active : Sequelize.BOOLEAN
    });
  
    return Course;
  };