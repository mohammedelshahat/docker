module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    "History",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      from: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      fromType: {
        type: DataTypes.STRING(255),
        enum: ["CTZN", "CMPNY", "SHOP"],
      },
      to: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      toType: {
        type: DataTypes.STRING(255),
        enum: ["CTZN", "CMPNY", "SHOP"],
      },
      itemKey: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      goldsmithId: {
        type: DataTypes.STRING(255),
      },
      goldsmithType: {
        type: DataTypes.STRING(255),
        enum: ["CTZN", "CMPNY", "SHOP"],
      },
      metalType: {
        type: DataTypes.STRING(255),
      },
      category: {
        type: DataTypes.STRING(255),
      },
      naming: {
        type: DataTypes.STRING(255),
      },
      itemStatus: {
        type: DataTypes.STRING(255),
        enum: [
          "STOLEN",
          "LOST",
          "MOLTEN",
          "RESTORED",
          "NEW",
          "MISSED",
          "DELETED",
        ],
      },
      fromRev: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      toRev: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      docType: {
        type: DataTypes.STRING(255),
        defaultValue: "transfer",
      },
      createdAt: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "history",
    }
  );
  History.associate = (models) => {
    // associations can be defined here
  };
  return History;
};
