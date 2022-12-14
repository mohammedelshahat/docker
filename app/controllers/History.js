const {
  getTransfer,
  getAllTransfers,
} = require('../services/history');

const { controller } = require('../middleware/controller');

module.exports = {
  getTransfer: controller(getTransfer),
  getAllTransfers: controller(getAllTransfers),
};
