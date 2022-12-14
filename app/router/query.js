const router = require('express-promise-router')();

const { validate } = require('../middleware/validator');

const { citizenItemsSchema } = require('../requestSchema/query/citizenOwnedItemSchema');
const { companyItemsSchema } = require('../requestSchema/query/companyOwnedItemSchema');
const { shopItemsSchema } = require('../requestSchema/query/shopOwnedItemSchema');
const { dateItemsSchema } = require('../requestSchema/query/dateTotalCountSchema');
const { dateTotalCTZNSchema } = require('../requestSchema/query/dateTotalCTZNCount');
const { dateTotalCMPNYSchema } = require('../requestSchema/query/dateTotalCMPNYCount');
const { dateTotalSHOPSchema } = require('../requestSchema/query/dateTotalSHOPCount');
const { hallmarkingReportSchema } = require('../requestSchema/query/hallmarkingReportSchema');
const { ownedReportSchema } = require('../requestSchema/query/ownedReportSchema');
const { transferReportSchema } = require('../requestSchema/query/transferReportSchema');

const {
  itemTotalCount,
  citizenOwnedItems,
  companyOwned,
  shopOwned,
  dateTotalCount,
  dateOwnedCTZNCount,
  dateOwnedCMPNYCount,
  dateOwnedSHOPCount,
  dateHallmarkedCTZNCount,
  dateHallmarkedCMPNYCount,
  dateHallmarkedSHOPCount,
  hallmarkingReport,
  ownedReport,
  transferReport,
} = require('../controllers/Query');

router.get('/item/count/total', itemTotalCount);
router.get('/item/count/citizen/:citizenId', validate(citizenItemsSchema), citizenOwnedItems);
router.get('/item/count/company/:companyId', validate(companyItemsSchema), companyOwned);
router.get('/item/count/shop/:shopId', validate(shopItemsSchema), shopOwned);
router.get('/item/count/total/date', validate(dateItemsSchema), dateTotalCount);
router.get('/item/count/total/date/citizen/:citizenId', validate(dateTotalCTZNSchema), dateOwnedCTZNCount);
router.get('/item/count/total/date/company/:companyId', validate(dateTotalCMPNYSchema), dateOwnedCMPNYCount);
router.get('/item/count/total/date/shop/:shopId', validate(dateTotalSHOPSchema), dateOwnedSHOPCount);
router.get('/item/count/total/date/citizen/hallmarked/:citizenId',
  validate(dateTotalCTZNSchema), dateHallmarkedCTZNCount);
router.get('/item/count/total/date/company/hallmarked/:companyId',
  validate(dateTotalCMPNYSchema), dateHallmarkedCMPNYCount);
router.get('/item/count/total/date/shop/hallmarked/:shopId',
  validate(dateTotalSHOPSchema), dateHallmarkedSHOPCount);

router.get('/item/report/hallmarking', validate(hallmarkingReportSchema), hallmarkingReport);
router.get('/item/report/owned', validate(ownedReportSchema), ownedReport);
router.get('/item/report/transfer', validate(transferReportSchema), transferReport);

exports.queryRouter = router;
