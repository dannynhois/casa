module.exports = function(sequelize, Sequelize) {
  var House = sequelize.define("House", {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    zpid: {
        type: Sequelize.INTEGER
    },
 
     address: {
        type: Sequelize.STRING,
        notEmpty: true
    },

    sqft: {
        type: Sequelize.INTEGER,
        notEmpty: true
    },

    bedrooms: {
        type: Sequelize.INTEGER
    },

    yearbuilt: {
        type: Sequelize.TEXT
    },

    zestimate: {
        type: Sequelize.STRING

    },
    optional1:{
      type:Sequelize.STRING
    },
    optional2:{
      type:Sequelize.STRING
    },
    optional3:{
      type:Sequelize.STRING
    },
    optional4:{
      type:Sequelize.STRING
    },
    optional5:{
      type:Sequelize.STRING
    },
    optional6:{
      type:Sequelize.STRING
    },
    optional7:{
      type:Sequelize.STRING
    },
    optional8:{
      type:Sequelize.STRING
    },
    optional9:{
      type:Sequelize.STRING
    },
    optional10:{
      type:Sequelize.STRING
    }

  });

  House.associate = function(models){
    House.belongsTo(models.User,{
      foreignKey:{
        allowNull:false
      }
    });
  };

  return House;
};