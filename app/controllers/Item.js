const {
  create,
  createWithCitizen,
  getItemById,
  transferOwnership,
  changeStatus,
  itemDynamicSchema,
  getAllItems,
} = require('../services/item');

const {
  transferList,
  changeListStatus,
  getRelatedItems,
} = require('../services/itemList');

const {
  addItemImage,
  removeItemImage,
} = require('../services/images');

const { controller } = require('../middleware/controller');
const { validate } = require('../middleware/validator');
const { createSchema } = require('../requestSchema/item/create');
const { createWithCTZNSchema } = require('../requestSchema/item/createWithCTZN');

module.exports = {
  validateCreate: async (req, res, next) => {
    const dynamicSchema = await itemDynamicSchema();
    Object.assign(createSchema.properties.body.properties, dynamicSchema);
    req.dynamicSchema = dynamicSchema;
    validate(createSchema)(req, res, next);
  },
  validateCreateWithCitizen: async (req, res, next) => {
    const dynamicSchema = await itemDynamicSchema();
    Object.assign(createWithCTZNSchema.properties.body.properties.item.properties, dynamicSchema);
    req.dynamicSchema = dynamicSchema;
    validate(createWithCTZNSchema)(req, res, next);
  },
  create: controller(create),
  createWithCitizen: controller(createWithCitizen),
  getItemById: controller(getItemById),
  getRelatedItems: controller(getRelatedItems),
  transferOwnership: controller(transferOwnership),
  transferList: controller(transferList),
  itemStolen: controller(changeStatus('STOLEN')),
  itemLost: controller(changeStatus('LOST')),
  itemMolten: controller(changeStatus('MOLTEN')),
  itemListMolten: controller(changeListStatus('MOLTEN')),
  itemRestored: controller(changeStatus('RESTORED')),
  itemMissed: controller(changeStatus('MISSED')),
  itemDeleted: controller(changeStatus('DELETED')),
  addItemImage: controller(addItemImage),
  removeItemImage: controller(removeItemImage),
  getAllItems: controller(getAllItems),
};
