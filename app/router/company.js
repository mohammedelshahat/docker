const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { createSchema } = require('../requestSchema/company/create');
const { getByIdSchema } = require('../requestSchema/company/getById');
const { updateSchema } = require('../requestSchema/company/update');
const { getSchema } = require('../requestSchema/company/get');

const {
  create,
  getCompanyById,
  update,
  deleteCompany,
  getCompanies,
} = require('../controllers/Company');

router.post('/', validate(createSchema), create);
router.get('/:customerCode', validate(getByIdSchema), getCompanyById);
router.put('/:customerCode', validate(updateSchema), update);
router.delete('/:customerCode', validate(getByIdSchema), deleteCompany);

router.get('/', validate(getSchema), getCompanies);

exports.companyRouter = router;
