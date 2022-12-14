module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('params', [{
      id: 1,
      offchain: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('params', null, {});
  },
};
