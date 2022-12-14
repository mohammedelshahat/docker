const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { getByIdSchema } = require('../requestSchema/citizen/getById');
const { createSchema } = require('../requestSchema/citizen/create');
const { updateSchema } = require('../requestSchema/citizen/update');
const { getSchema } = require('../requestSchema/citizen/get');

const {
  create,
  getCitizenById,
  update,
  deleteCitizen,
  getCitizens,
} = require('../controllers/Citizen');

router.post('/', validate(createSchema), create);
router.get('/:citizenId', validate(getByIdSchema), getCitizenById);
router.put('/:citizenId', validate(updateSchema), update);
router.delete('/:citizenId', validate(getByIdSchema), deleteCitizen);

router.get('/', validate(getSchema), getCitizens);

exports.citizenRouter = router;
