const {
  create,
  getShopById,
  update,
  deleteShop,
  getShops,
} = require('../services/shop');

const { controller } = require('../middleware/controller');

module.exports = {
  create: controller(create),
  getShopById: controller(getShopById),
  update: controller(update),
  deleteShop: controller(deleteShop),
  getShops: controller(getShops),
};
