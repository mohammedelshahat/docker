const _ = require('lodash');
const { contracts } = require('../../../config');
const couchdb = require('../../../utils/couchdb');
const { query } = require('../../../fabric');
const { generateDateKeys } = require('./dateUtils');

const env = process.env.FABRIC_ENV || 'local';
const { channel } = require('../../../config').fabric[env];

exports.dateTotalCount = async ({ query: reqQuery }) => {
  const { from, to } = reqQuery;

  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const { err, status, data } = await couchdb.get({
    url:
    `${channel}_${contracts.item}/_design/count/_view/dateTotalItems?startkey=[${startkey}]&endkey=[${endkey},{}]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.dateTotalCTZNCount = (owned = true) => async ({ params, query: reqQuery }) => {
  const { citizenId } = params;
  const { from, to } = reqQuery;

  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

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

  const start = ['"CTZN"', `"${citizen.Key}"`, ...startkey];
  const end = ['"CTZN"', `"${citizen.Key}"`, ...endkey];

  const view = owned ? 'dateTotalOwnedItems' : 'dateTotalHallmarkedItems';
  const { err, status, data } = await couchdb.get({
    url:
    `${channel}_${contracts.item}/_design/count/_view/${view}?startkey=[${start}]&endkey=[${end},{}]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.dateTotalCMPNYCount = (owned = true) => async ({ params, query: reqQuery }) => {
  const { companyId } = params;
  const { from, to } = reqQuery;

  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const [company] = await query({
    chaincode: contracts.company,
    selector: {
      $or: [
        { _id: companyId },
      ],
    },
  });
  if (!company) return { err: `no company found with id:${companyId}`, status: 404 };

  const start = ['"CMPNY"', `"${company.Key}"`, ...startkey];
  const end = ['"CMPNY"', `"${company.Key}"`, ...endkey];

  const view = owned ? 'dateTotalOwnedItems' : 'dateTotalHallmarkedItems';
  const { err, status, data } = await couchdb.get({
    url:
    `${channel}_${contracts.item}/_design/count/_view/${view}?startkey=[${start}]&endkey=[${end},{}]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};

exports.dateTotalSHOPCount = (owned = true) => async ({ params, query: reqQuery }) => {
  const { shopId } = params;
  const { from, to } = reqQuery;

  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const [shop] = await query({
    chaincode: contracts.shop,
    selector: {
      $or: [
        { _id: shopId },
      ],
    },
  });
  if (!shop) return { err: `no shop found with id:${shopId}`, status: 404 };

  const start = ['"SHOP"', `"${shop.Key}"`, ...startkey];
  const end = ['"SHOP"', `"${shop.Key}"`, ...endkey];

  const view = owned ? 'dateTotalOwnedItems' : 'dateTotalHallmarkedItems';
  const { err, status, data } = await couchdb.get({
    url:
    `${channel}_${contracts.item}/_design/count/_view/${view}?startkey=[${start}]&endkey=[${end},{}]`,
  });
  if (err) return { err, status };

  const count = _.get(data, ['rows', 0, 'value'], 0);

  return {
    message: 'query successful',
    data: { count },
  };
};
