module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "Item",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      itemKey: {
        type: DataTypes.STRING(255),
      },
      itemCode: {
        type: DataTypes.STRING(255),
        validate: {
          is: ["^[A-Z0-9]{10}$", "i"],
        },
      },
      yearCode: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 2],
        },
      },
      milleniumRatio: {
        type: DataTypes.INTEGER,
      },
      ownerId: {
        type: DataTypes.STRING(255),
      },
      ownerType: {
        type: DataTypes.STRING(255),
        enum: ["CTZN", "CMPNY", "SHOP"],
      },
      isParent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      itemParentId: {
        type: DataTypes.STRING(255),
        validate: {
          len: [5, 11],
        },
      },
      description: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 51],
        },
      },
      hallmarkingDate: {
        type: DataTypes.STRING(255),
      },
      goldsmithId: {
        type: DataTypes.STRING(255),
      },
      goldsmithType: {
        type: DataTypes.STRING(255),
        enum: ["CTZN", "CMPNY", "SHOP"],
      },
      boxId: {
        type: DataTypes.INTEGER,
      },
      isOverlay: {
        type: DataTypes.BOOLEAN,
      },
      overlayMetal: {
        type: DataTypes.STRING(255),
        validate: {
          len: [0, 5],
        },
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
        defaultValue: "NEW",
      },
      weight: {
        type: DataTypes.INTEGER,
      },
      images: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("images"));
        },
        set: function (val) {
          return this.setDataValue("images", JSON.stringify(val));
        },
      },
      folderId: {
        type: DataTypes.STRING(255),
      },
      docType: {
        type: DataTypes.STRING(255),
        defaultValue: "item",
      },
      createdAt: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "item",
    }
  );
  Item.associate = (models) => {
    // associations can be defined here
  };
  return Item;
};
