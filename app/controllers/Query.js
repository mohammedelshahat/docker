const {
  totalCount,
  citizenOwned,
  companyOwned,
  shopOwned,
} = require('../services/couchdb/itemCount');

const {
  dateTotalCount,
  dateTotalCTZNCount,
  dateTotalCMPNYCount,
  dateTotalSHOPCount,
} = require('../services/couchdb/itemDateCount');

const {
  hallmarkingReport,
  ownedReport,
  transferReport,
} = require('../services/couchdb/reports');

const { controller } = require('../middleware/controller');

module.exports = {
  itemTotalCount: controller(totalCount),
  citizenOwnedItems: controller(citizenOwned),
  companyOwned: controller(companyOwned),
  shopOwned: controller(shopOwned),
  dateTotalCount: controller(dateTotalCount),
  dateOwnedCTZNCount: controller(dateTotalCTZNCount(true)),
  dateOwnedCMPNYCount: controller(dateTotalCMPNYCount(true)),
  dateOwnedSHOPCount: controller(dateTotalSHOPCount(true)),
  dateHallmarkedCTZNCount: controller(dateTotalCTZNCount(false)),
  dateHallmarkedCMPNYCount: controller(dateTotalCMPNYCount(false)),
  dateHallmarkedSHOPCount: controller(dateTotalSHOPCount(false)),
  hallmarkingReport: controller(hallmarkingReport),
  ownedReport: controller(ownedReport),
  transferReport: controller(transferReport),
};
