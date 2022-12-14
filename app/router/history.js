const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { getTransferSchema } = require('../requestSchema/history/getTransfer');
const { getAllTransfersSchema } = require('../requestSchema/history/getAllTransfers');

const {
  getTransfer,
  getAllTransfers,
} = require('../controllers/History');

router.get('/transfer/all', validate(getAllTransfersSchema), getAllTransfers);
router.get('/transfer', validate(getTransferSchema), getTransfer);

exports.historyRouter = router;
