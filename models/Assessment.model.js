module.exports = (sequelize, Sequelize) => {
    const Assessment = sequelize.define("Assessment", {
      assessmentType: {
        // type: Sequelize.STRING
        type: Sequelize.ENUM,
        values: ['Activity', 'Class Test', 'Practical','Assignment','Demo','Project','Mini Project','Sememster Test','Exam','Tutorial','Tutorial Test']
      },
      assessmentName: {
        type: Sequelize.STRING,
      },
      perWeight : {
          type: Sequelize.DECIMAL
      },
      active:{
          type: Sequelize.BOOLEAN
      },
      total:{
          type: Sequelize.DECIMAL 
      }
    });

    return Assessment;
  };
