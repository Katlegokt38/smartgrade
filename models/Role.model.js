module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("Role", {
      roleType: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Role;
  };