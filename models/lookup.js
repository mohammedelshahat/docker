module.exports = (sequelize, DataTypes) => {
  const Lookup = sequelize.define('Lookup', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    enumId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'enum',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'lookup',
  });
  Lookup.associate = (models) => {
    // associations can be defined here
    Lookup.belongsTo(models.Enum, { foreignKey: 'enumId' });
  };
  return Lookup;
};
