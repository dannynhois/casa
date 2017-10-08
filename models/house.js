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
        type: Sequelize.STRING
    },

    zestimate: {
        type: Sequelize.STRING

    },
    kitchen:{
      type:Sequelize.STRING
    },
    garage:{
      type:Sequelize.STRING
    },
    remodel:{
      type:Sequelize.STRING
    },
    schools:{
      type:Sequelize.STRING
    },
    study:{
      type:Sequelize.STRING
    },
    features:{
      type:Sequelize.STRING
    },
    location:{
      type:Sequelize.STRING
    },
    tax:{
      type:Sequelize.STRING
    },
    sizes:{
      type:Sequelize.STRING
    }

  });

  House.associate = function(models){
    House.belongsTo(models.User,{
      foreignKey:{
        allowNull:false
      }
    });
    House.hasMany(models.Comment);
  };

  return House;
};