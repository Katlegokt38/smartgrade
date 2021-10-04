module.exports = (sequelize, Sequelize) => {
    const AssessmentType = sequelize.define("Assessment Type", {
      assessmentType: {
        type: Sequelize.STRING
      },
      active:{
          type: Sequelize.BOOLEAN
      }
    });

    return AssessmentType;
  };
