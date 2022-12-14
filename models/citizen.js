module.exports = (sequelize, DataTypes) => {
  const Citizen = sequelize.define(
    "Citizen",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      citizenNationalId: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      passportNumber: {
        type: DataTypes.STRING(255),
      },
      name: {
        type: DataTypes.STRING(255)
      },
      customerType: {
        type: DataTypes.STRING(255),
      },
      contactNumbers: {
        type: DataTypes.STRING(255),
        get: function () {
          return JSON.parse(this.getDataValue("contactNumbers"));
        },
        set: function (val) {
          return this.setDataValue("contactNumbers", JSON.stringify(val));
        },
      },
      email: {
        type: DataTypes.STRING(255),
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 41],
        },
      },
      docType: {
        type: DataTypes.STRING(255),
        defaultValue: "citizen",
      },
      createdAt: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "citizen",
    }
  );
  Citizen.associate = (models) => {
    // associations can be defined here
  };
  return Citizen;
};
