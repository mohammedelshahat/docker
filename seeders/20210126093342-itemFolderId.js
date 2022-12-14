module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('enum', [{
      id: 6,
      chaincode: 'item',
      name: 'naming',
      description: 'item naming',
      errorMessage: 'ER_INVALID_NAMING:Invalid naming',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
    await queryInterface.bulkInsert('lookup', [{
      enumId: 6,
      name: 'customNaming',
      code: 'customNaming',
      description: 'item customNaming naming',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('enum', null, {});
    await queryInterface.bulkDelete('lookup', null, {});
  },
};
