module.exports = (sequelize, Sequelize) => {
    const Marks = sequelize.define("Marks", {
      studentNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
       courseId: {
         type: Sequelize.INTEGER
       },
       assessmentId: {
         type: Sequelize.INTEGER
       },
      mark: {
        type: Sequelize.INTEGER
      },
      totalMark: {
        type: Sequelize.INTEGER
      },
      perWeight : {
        type: Sequelize.DECIMAL
      }
    });

    return Marks;
  };
