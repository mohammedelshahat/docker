module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define(
    "Shop",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      customerCode: {
        type: DataTypes.STRING(255),
      },
      customerType: {
        type: DataTypes.STRING(255),
      },
      taxCardNumber: {
        type: DataTypes.STRING(255),
      },
      taxFileNumber: {
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
      },
      address: {
        type: DataTypes.STRING(255),
      },
      licenseNumber: {
        type: DataTypes.STRING(255),
      },
      notificationType: {
        type: DataTypes.STRING(255),
      },
      isActive: {
        type: DataTypes.BOOLEAN,
      },
      docType: {
        type: DataTypes.STRING(255),
        defaultValue: "shop",
      },
      createdAt: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "shop",
    }
  );
  Shop.associate = (models) => {
    // associations can be defined here
  };
  return Shop;
};
