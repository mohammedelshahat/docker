const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { getByIdSchema } = require('../requestSchema/item/getById');
const { transferSchema } = require('../requestSchema/item/transfer');
const { transferListSchema } = require('../requestSchema/item/transferList');
const { statusSchema } = require('../requestSchema/item/changeStatus');
const { changeListSchema } = require('../requestSchema/item/changeListStatus');
const { addImageSchema } = require('../requestSchema/item/addImage');
const { removeImageSchema } = require('../requestSchema/item/removeImage');
const { getAllItemsSchema } = require('../requestSchema/item/getAllItems');

const {
  create,
  validateCreate,
  createWithCitizen,
  validateCreateWithCitizen,
  getItemById,
  getRelatedItems,
  transferOwnership,
  transferList,
  itemStolen,
  itemRestored,
  itemMolten,
  itemListMolten,
  itemLost,
  itemMissed,
  itemDeleted,
  addItemImage,
  removeItemImage,
  getAllItems,
} = require('../controllers/Item');

router.post('/', validateCreate, create);
router.post('/citizen', validateCreateWithCitizen, createWithCitizen);
router.put('/ownership', validate(transferListSchema), transferList);
router.put('/status/molten', validate(changeListSchema), itemListMolten);
router.put('/image/add/:itemKey', validate(addImageSchema), addItemImage);
router.put('/image/remove/:itemKey', validate(removeImageSchema), removeItemImage);
router.get('/:itemKey', validate(getByIdSchema), getItemById);
router.get('/:itemKey/related', validate(getByIdSchema), getRelatedItems);
router.put('/:itemKey/ownership', validate(transferSchema), transferOwnership);
router.put('/:itemKey/stolen', validate(statusSchema), itemStolen);
router.put('/:itemKey/restored', validate(statusSchema), itemRestored);
router.put('/:itemKey/molten', validate(statusSchema), itemMolten);
router.put('/:itemKey/lost', validate(statusSchema), itemLost);
router.put('/:itemKey/missed', validate(statusSchema), itemMissed);
router.delete('/:itemKey/deleted', validate(statusSchema), itemDeleted);

// get all items
router.get('/', validate(getAllItemsSchema), getAllItems);

exports.itemRouter = router;
