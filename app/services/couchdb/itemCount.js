const _ = require('lodash');
const { contracts } = require('../../../config');
const couchdb = require('../../../utils/couchdb');
const { query } = require('../../../fabric');

const env = process.env.FABRIC_ENV || 'local';
const { channel } = require('../../../config').fabric[env];

exports.totalCount = async () => {
  const { err, status, data } = await couchdb.get({
    url: `${channel}_${contracts.item}/_design/count/_view/totalItems`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.citizenOwned = async ({ params }) => {
  const { citizenId } = params;

  const [citizen] = await query({
    chaincode: contracts.citizen,
    selector: {
      $or: [
        { _id: citizenId },
        { citizenNationalId: citizenId },
        { passportNumber: citizenId },
      ],
    },
  });
  if (!citizen) return { err: `no citizen found with id:${citizenId}`, status: 404 };

  const { err, status, data } = await couchdb.get({
    url: `${channel}_${contracts.item}/_design/count/_view/ownedItems/?key=["CTZN", "${citizen.Key}"]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.companyOwned = async ({ params }) => {
  const { companyId } = params;

  const [company] = await query({
    chaincode: contracts.company,
    selector: {
      $or: [
        { _id: companyId },
      ],
    },
  });
  if (!company) return { err: `no company found with id:${companyId}`, status: 404 };

  const { err, status, data } = await couchdb.get({
    url: `${channel}_${contracts.item}/_design/count/_view/ownedItems/?key=["CMPNY", "${company.Key}"]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.shopOwned = async ({ params }) => {
  const { shopId } = params;

  const [shop] = await query({
    chaincode: contracts.shop,
    selector: {
      $or: [
        { _id: shopId },
      ],
    },
  });
  if (!shop) return { err: `no shop found with id:${shopId}`, status: 404 };

  const { err, status, data } = await couchdb.get({
    url: `${channel}_${contracts.item}/_design/count/_view/ownedItems/?key=["SHOP", "${shop.Key}"]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};
