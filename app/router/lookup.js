const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { getEnumSchema } = require('../requestSchema/lookup/getEnum');
const { getLookupSchema } = require('../requestSchema/lookup/getLookup');
const { addLookupSchema } = require('../requestSchema/lookup/addLookup');
const { updateLookupSchema } = require('../requestSchema/lookup/updateLookup');
const { deleteLookupSchema } = require('../requestSchema/lookup/deleteLookup');

const {
  getEnums,
  getLookups,
  addLookups,
  updateLookups,
  deleteLookups,
} = require('../controllers/Lookup');

router.get('/enum', validate(getEnumSchema), getEnums);
router.post('/', validate(addLookupSchema), addLookups);
router.get('/', validate(getLookupSchema), getLookups);
router.put('/:id', validate(updateLookupSchema), updateLookups);
router.delete('/:id', validate(deleteLookupSchema), deleteLookups);

exports.lookupRouter = router;
