const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { createSchema } = require('../requestSchema/shop/create');
const { getByIdSchema } = require('../requestSchema/shop/getById');
const { updateSchema } = require('../requestSchema/shop/update');
const { getSchema } = require('../requestSchema/shop/get');

const {
  create,
  getShopById,
  update,
  deleteShop,
  getShops,
} = require('../controllers/Shop');

router.post('/', validate(createSchema), create);
router.get('/:customerCode', validate(getByIdSchema), getShopById);
router.put('/:customerCode', validate(updateSchema), update);
router.delete('/:customerCode', validate(getByIdSchema), deleteShop);

router.get('/', validate(getSchema), getShops);

exports.shopRouter = router;
