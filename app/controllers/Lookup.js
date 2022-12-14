const {
  getEnums,
  getLookups,
  addLookups,
  updateLookups,
  deleteLookups,
} = require('../services/lookup');

const { controller } = require('../middleware/controller');

module.exports = {
  getEnums: controller(getEnums),
  getLookups: controller(getLookups),
  addLookups: controller(addLookups),
  updateLookups: controller(updateLookups),
  deleteLookups: controller(deleteLookups),
};
