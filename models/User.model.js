module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      upNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING
      },
      lastLogin : {
        type: Sequelize.DATE
      }

    });

    return User;
  };
