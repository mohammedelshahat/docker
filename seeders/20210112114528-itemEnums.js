module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('enum', [{
      id: 1,
      chaincode: 'item',
      name: 'metalType',
      description: 'item metal types',
      errorMessage: 'ER_INVALID_METAL_TYPE:Invalid metal type',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 2,
      chaincode: 'item',
      name: 'category',
      description: 'item categories',
      errorMessage: 'ER_INVALID_CATEGORY:Invalid category',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 3,
      chaincode: 'item',
      name: 'caliber',
      description: 'item calibers',
      errorMessage: 'ER_INVALID_CALIBER: Invalid caliber',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 4,
      chaincode: 'item',
      name: 'origin',
      description: 'item origin',
      errorMessage: 'ER_INVALID_ORIGIN:Invalid origin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 5,
      chaincode: 'item',
      name: 'awaBranch',
      description: 'item AWA branch',
      errorMessage: 'ER_INVALID_BRANCH:Invalid Branch',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('enum', null, {});
  },
};
