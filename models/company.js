module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      customerCode: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 16],
        },
      },
      customerType: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 6],
        },
      },
      taxCardNumber: {
        type: DataTypes.STRING(255),
      },
      taxFileNumber: {
        type: DataTypes.STRING(255),
      },
      commercialNumber: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 256],
        },
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
      licenseNumber: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 16],
        },
      },
      notificationType: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 256],
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
      docType: {
        type: DataTypes.STRING(255),
        defaultValue: "company",
      },
      createdAt: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "company",
    }
  );
  Company.associate = (models) => {
    // associations can be defined here
  };
  return Company;
};
