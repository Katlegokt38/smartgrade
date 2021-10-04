module.exports = (sequelize, Sequelize) => {
    const Module = sequelize.define("Module", {
      moduleCode: {
        type: Sequelize.STRING
      },
      moduleName: {
        type: Sequelize.STRING,
      },
      active : Sequelize.BOOLEAN
      });
  
    return Module;
  };