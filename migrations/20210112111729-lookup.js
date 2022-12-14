module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lookup', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      enumId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'enum',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('lookup');
  },
};
