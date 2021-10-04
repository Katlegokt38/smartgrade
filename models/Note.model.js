module.exports = (sequelize, Sequelize) => {
    const Notes = sequelize.define( "Note", {
      course: {
        type: Sequelize.STRING
      },
      educator: {
        type: Sequelize.STRING,    
      },
      noteDescription: {
          type: Sequelize.STRING
        }    
      });
  
    return Notes;
  };