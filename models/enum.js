module.exports = (sequelize, DataTypes) => {
  const Enum = sequelize.define('Enum', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    chaincode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  }, {
    tableName: 'enum',
  });
  Enum.associate = (models) => {
    // associations can be defined here
    Enum.hasMany(models.Lookup, { foreignKey: 'enumId' });
  };
  return Enum;
};
