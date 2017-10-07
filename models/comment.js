module.exports = function(sequelize, Sequelize) {
  var Comment = sequelize.define("Comment", {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.STRING,
      notEmpty: true
    }
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, { foreignKey: { allowNull: false } }); // closes belong to
    Comment.belongsTo(models.House, { foreignKey: { allowNull: false } }); // closes belong to
  };

  return Comment;
};
