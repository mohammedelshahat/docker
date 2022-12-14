/* eslint-disable array-callback-return */

const _ = require('lodash');
const { contracts } = require('../../../config');
const couchdb = require('../../../utils/couchdb');
const { generateDateKeys } = require('./dateUtils');

const env = process.env.FABRIC_ENV || 'local';
const { channel } = require('../../../config').fabric[env];

function splitKey(key) {
  let type = key.slice(-4);
  let id = key.slice(0, -5);
  if (type !== 'CTZN' && type !== 'SHOP') {
    type = key.slice(-5);
    id = key.slice(0, -6);
  }
  return { id, type };
}

exports.hallmarkingReport = async ({ query }) => {
  const { from, to } = query;
  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const baseUrl = `${channel}_${contracts.item}/_design/detailedReports/_view/hallmarkingCount`;
  const report = {};
  const usersKey = {
    CTZN: {},
    SHOP: {},
    CMPNY: {},
  };

  const { data, err, status } = await couchdb.get({
    url: `${baseUrl}?group_level=8&startkey=[1,${startkey}]&endkey=[1,${endkey},{}]`,
  });
  if (err) return { err, status };

  let totalCount = 0;
  const rows = _.get(data, ['rows'], []);
  if (rows.length === 1 && rows[0].key === null) rows.pop();

  rows.map((row) => {
    const { key, value } = row;
    totalCount += value;

    // daily view response example: [1, 2021, 3, 31, goldsmithId, ....]
    const [,,,, goldsmithKey, metalType, category, naming] = key;

    let goldsmithType = goldsmithKey.slice(-4);
    let goldsmithId = goldsmithKey.slice(0, -5);
    if (goldsmithType !== 'CTZN' && goldsmithType !== 'SHOP') {
      goldsmithType = goldsmithKey.slice(-5);
      goldsmithId = goldsmithKey.slice(0, -6);
    }

    usersKey[goldsmithType][goldsmithId] = true;

    if (!report[goldsmithKey]) {
      report[goldsmithKey] = {
        total: value,
        goldsmithId,
        goldsmithType,
      };
    } else report[goldsmithKey].total += value;

    if (!report[goldsmithKey][metalType]) report[goldsmithKey][metalType] = { total: value };
    else report[goldsmithKey][metalType].total += value;

    if (!report[goldsmithKey][metalType][category]) {
      report[goldsmithKey][metalType][category] = { total: value };
    } else report[goldsmithKey][metalType][category].total += value;

    if (naming) {
      if (!report[goldsmithKey][metalType][category][naming]) {
        report[goldsmithKey][metalType][category][naming] = { total: value };
      } else {
        report[goldsmithKey][metalType][category][naming].total += value;
      }
    }
  });

  // get goldsmith names
  const shopUrl = `${channel}_${contracts.shop}/_design/report/_view/name`;
  const citizenUrl = `${channel}_${contracts.citizen}/_design/report/_view/name`;
  const companyUrl = `${channel}_${contracts.company}/_design/report/_view/name`;

  const ctznNames = Object.keys(usersKey.CTZN).map((k) => `"${k}"`);
  const shopNames = Object.keys(usersKey.SHOP).map((k) => `"${k}"`);
  const cmpnyNames = Object.keys(usersKey.CMPNY).map((k) => `"${k}"`);

  const [ctznRes, shopRes, cmpnyRes] = await Promise.all([
    couchdb.get({ url: `${citizenUrl}?keys=[${ctznNames}]` }),
    couchdb.get({ url: `${shopUrl}?keys=[${shopNames}]` }),
    couchdb.get({ url: `${companyUrl}?keys=[${cmpnyNames}]` }),
  ]);
  if (ctznRes.err) return { err: ctznRes.err, status: ctznRes.status };
  if (shopRes.err) return { err: shopRes.err, status: shopRes.status };
  if (cmpnyRes.err) return { err: cmpnyRes.err, status: cmpnyRes.status };

  const ctznRows = ctznRes.data.rows || [];
  const shopRows = shopRes.data.rows || [];
  const cmpnyRows = cmpnyRes.data.rows || [];
  ctznRows.map((row) => { report[`${row.id}_CTZN`].goldsmithName = row.value; });
  shopRows.map((row) => { report[`${row.id}_SHOP`].goldsmithName = row.value; });
  cmpnyRows.map((row) => { report[`${row.id}_CMPNY`].goldsmithName = row.value; });

  return {
    data: {
      totalCount,
      report: Object.values(report),
    },
  };
};

exports.ownedReport = async ({ query }) => {
  const { ownerId, ownerType, date } = query;
  const { err: dateErr, status: dateStatus, endkey } = generateDateKeys('1970-01-01', date);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const baseUrl = `${channel}_${contracts.item}/_design/detailedReports/_view`;
  const owner = `${ownerId}_${ownerType}`;

  const { data: toTransfer, err: err1, status: status1 } = await couchdb.get({
    url: `${baseUrl}/toTransfer?startkey=["${owner}"]&endkey=["${owner}",{}]`,
  });
  if (err1) return { err: err1, status: status1 };
  const toTransferRows = _.get(toTransfer, ['rows'], []);
  if (toTransferRows.length === 1 && toTransferRows[0].key === null) toTransferRows.pop();

  const toTransferObj = {};
  const toTransferAfter = {};
  toTransferRows.map((row) => {
    const { value } = row;
    const { itemKey, createdAt, ...info } = value;
    const createDate = new Date(+`${createdAt}000`).getTime();
    const inputDate = new Date(date).getTime();

    if (createDate < inputDate) {
      if (toTransferObj[itemKey]) {
        const existingDate = +toTransferObj[itemKey].createdAt;
        const newDate = +createdAt;
        if (existingDate < newDate) {
          toTransferObj[itemKey] = { createdAt, info };
        }
      } else {
        toTransferObj[itemKey] = { createdAt, info };
      }
    } else {
      toTransferAfter[itemKey] = info;
    }
  });

  const { data: fromTransfer, err: err2, status: status2 } = await couchdb.get({
    url: `${baseUrl}/fromTransfer?startkey=["${owner}"]&endkey=["${owner}", ${endkey},{}]`,
  });
  if (err2) return { err: err2, status: status2 };
  const fromTransferRows = _.get(fromTransfer, ['rows'], []);
  if (fromTransferRows.length === 1 && fromTransferRows[0].key === null) fromTransferRows.pop();

  const fromTransferObj = {};
  fromTransferRows.map((row) => {
    const { itemKey, createdAt, ...info } = row.value;
    // fromTransferObj[itemKey] = { createdAt, info };

    if (fromTransferObj[itemKey]) {
      const existingDate = +fromTransferObj[itemKey].createdAt;
      const newDate = +createdAt;
      if (existingDate < newDate) {
        fromTransferObj[itemKey] = { createdAt, info };
      }
    } else {
      fromTransferObj[itemKey] = { createdAt, info };
    }
  });

  const { data: items, err, status } = await couchdb.get({
    url: `${baseUrl}/ownedItems?startkey=["${owner}"]&endkey=["${owner}", ${endkey},{}]`,
  });
  if (err) return { err, status };

  const itemRows = _.get(items, ['rows'], []);

  const itemObj = {};
  if (itemRows.length === 1 && itemRows[0].key === null) itemRows.pop();
  itemRows.map((row) => {
    const { id, value } = row;
    if (!toTransferAfter[id]) {
      itemObj[id] = value;
    }
  });

  Object.keys(toTransferObj).map((key) => {
    const { createdAt, info } = toTransferObj[key];
    let removedAt = 0;
    if (fromTransferObj[key]) {
      removedAt = +fromTransferObj[key].createdAt;
    }
    if (+createdAt > removedAt) {
      if (!itemObj[key]) itemObj[key] = info;
    }
  });

  let totalCount = 0;
  const report = {};
  const usersKey = {
    CTZN: {},
    SHOP: {},
    CMPNY: {},
  };
  Object.values(itemObj).map((item) => {
    totalCount += 1;
    const { goldsmithId, goldsmithType, metalType, category, naming, itemStatus } = item;

    const goldsmithKey = `${goldsmithId}_${goldsmithType}`;
    usersKey[goldsmithType][goldsmithId] = true;

    if (!report[goldsmithKey]) {
      report[goldsmithKey] = {
        total: 1,
        goldsmithId,
        goldsmithType,
      };
    } else report[goldsmithKey].total += 1;

    if (!report[goldsmithKey][metalType]) report[goldsmithKey][metalType] = { total: 1 };
    else report[goldsmithKey][metalType].total += 1;

    if (!report[goldsmithKey][metalType][category]) {
      report[goldsmithKey][metalType][category] = { total: 1 };
    } else report[goldsmithKey][metalType][category].total += 1;

    if (naming) {
      if (!report[goldsmithKey][metalType][category][naming]) {
        report[goldsmithKey][metalType][category][naming] = { total: 1 };
      } else {
        report[goldsmithKey][metalType][category][naming].total += 1;
      }

      if (!report[goldsmithKey][metalType][category][naming][itemStatus]) {
        report[goldsmithKey][metalType][category][naming][itemStatus] = 1;
      } else {
        report[goldsmithKey][metalType][category][naming][itemStatus] += 1;
      }
    }
  });

  // get goldsmith names
  const shopUrl = `${channel}_${contracts.shop}/_design/report/_view/name`;
  const citizenUrl = `${channel}_${contracts.citizen}/_design/report/_view/name`;
  const companyUrl = `${channel}_${contracts.company}/_design/report/_view/name`;

  const ctznNames = Object.keys(usersKey.CTZN).map((k) => `"${k}"`);
  const shopNames = Object.keys(usersKey.SHOP).map((k) => `"${k}"`);
  const cmpnyNames = Object.keys(usersKey.CMPNY).map((k) => `"${k}"`);

  const [ctznRes, shopRes, cmpnyRes] = await Promise.all([
    couchdb.get({ url: `${citizenUrl}?keys=[${ctznNames}]` }),
    couchdb.get({ url: `${shopUrl}?keys=[${shopNames}]` }),
    couchdb.get({ url: `${companyUrl}?keys=[${cmpnyNames}]` }),
  ]);
  if (ctznRes.err) return { err: ctznRes.err, status: ctznRes.status };
  if (shopRes.err) return { err: shopRes.err, status: shopRes.status };
  if (cmpnyRes.err) return { err: cmpnyRes.err, status: cmpnyRes.status };

  const ctznRows = ctznRes.data.rows || [];
  const shopRows = shopRes.data.rows || [];
  const cmpnyRows = cmpnyRes.data.rows || [];
  ctznRows.map((row) => { report[`${row.id}_CTZN`].goldsmithName = row.value; });
  shopRows.map((row) => { report[`${row.id}_SHOP`].goldsmithName = row.value; });
  cmpnyRows.map((row) => { report[`${row.id}_CMPNY`].goldsmithName = row.value; });

  return {
    data: {
      totalCount,
      report: Object.values(report),
    },
  };
};

exports.transferReport = async ({ query }) => {
  const { from, to } = query;
  const { err: dateErr, status: dateStatus, startkey, endkey } = generateDateKeys(from, to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const baseUrl = `${channel}_${contracts.item}/_design/detailedReports/_view/transferCount`;
  const report = {};

  const { data, err, status } = await couchdb.get({
    url: `${baseUrl}?group_level=10&startkey=[1,${startkey}]&endkey=[1,${endkey},{}]`,
  });
  if (err) return { err, status };

  let totalCount = 0;
  const rows = _.get(data, ['rows'], []);
  if (rows.length === 1 && rows[0].key === null) rows.pop();

  rows.map((row) => {
    const { key, value } = row;
    totalCount += value;

    // daily view response example: [1, 2021, 3, 31, fromId, ....]
    const [,,,, fromKey, toKey, goldsmithKey, metalType, category, naming] = key;

    const { id: fromId, type: fromType } = splitKey(fromKey);
    const { id: toId, type: toType } = splitKey(toKey);
    const { id: goldsmithId, type: goldsmithType } = splitKey(goldsmithKey);

    if (!report[fromKey]) {
      report[fromKey] = {
        total: value,
        fromId,
        fromType,
      };
    } else report[fromKey].total += value;

    if (!report[fromKey][toKey]) {
      report[fromKey][toKey] = {
        total: value,
        toId,
        toType,
      };
    } else report[fromKey][toKey].total += value;

    if (!report[fromKey][toKey][goldsmithKey]) {
      report[fromKey][toKey][goldsmithKey] = {
        total: value,
        goldsmithId,
        goldsmithType,
      };
    } else report[fromKey][toKey][goldsmithKey].total += value;

    if (!report[fromKey][toKey][goldsmithKey][metalType]) {
      report[fromKey][toKey][goldsmithKey][metalType] = { total: value };
    } else report[fromKey][toKey][goldsmithKey][metalType].total += value;

    if (!report[fromKey][toKey][goldsmithKey][metalType][category]) {
      report[fromKey][toKey][goldsmithKey][metalType][category] = { total: value };
    } else report[fromKey][toKey][goldsmithKey][metalType][category].total += value;

    if (naming) {
      if (!report[fromKey][toKey][goldsmithKey][metalType][category][naming]) {
        report[fromKey][toKey][goldsmithKey][metalType][category][naming] = { total: value };
      } else {
        report[fromKey][toKey][goldsmithKey][metalType][category][naming].total += value;
      }
    }
  });

  return {
    data: {
      totalCount,
      report: Object.values(report),
    },
  };
};

// negative sign values when calculating item status
// as item status can change between transfers
exports.efficientOwnedReport = async ({ query }) => {
  const { ownerId, ownerType, to } = query;
  const { err: dateErr, status: dateStatus, endkey } = generateDateKeys('1970-01-01', to);
  if (dateErr) return { err: dateErr, status: dateStatus };

  const baseUrl = `${channel}_${contracts.item}/_design/detailedReports/_view/advancedOwnedCount`;
  const report = {};
  const usersKey = {
    CTZN: {},
    SHOP: {},
    CMPNY: {},
  };

  const owner = `"${ownerId}_${ownerType}"`;
  const { data, err, status } = await couchdb.get({
    url: `${baseUrl}?group_level=9&startkey=[${owner}]&endkey=[${owner},${endkey},{}]`,
  });
  if (err) return { err, status };

  let totalCount = 0;
  const rows = _.get(data, ['rows'], []);
  if (rows.length === 1 && rows[0].key === null) rows.pop();

  rows.map((row) => {
    const { key, value } = row;
    totalCount += value;

    // daily view response example: [owner_CTZN, 2021, 3, 31, goldsmithKey, ....]
    const [,,,, goldsmithKey, metalType, category, naming, itemStatus] = key;

    const { id: goldsmithId, type: goldsmithType } = splitKey(goldsmithKey);
    usersKey[goldsmithType][goldsmithId] = true;

    if (!report[goldsmithKey]) {
      report[goldsmithKey] = {
        total: value,
        goldsmithId,
        goldsmithType,
      };
    } else report[goldsmithKey].total += value;

    if (!report[goldsmithKey][metalType]) report[goldsmithKey][metalType] = { total: value };
    else report[goldsmithKey][metalType].total += value;

    if (!report[goldsmithKey][metalType][category]) {
      report[goldsmithKey][metalType][category] = { total: value };
    } else report[goldsmithKey][metalType][category].total += value;

    if (naming) {
      if (!report[goldsmithKey][metalType][category][naming]) {
        report[goldsmithKey][metalType][category][naming] = { total: value };
      } else {
        report[goldsmithKey][metalType][category][naming].total += value;
      }

      if (!report[goldsmithKey][metalType][category][naming][itemStatus]) {
        report[goldsmithKey][metalType][category][naming][itemStatus] = value;
      } else {
        report[goldsmithKey][metalType][category][naming][itemStatus] += value;
      }
    }
  });

  return {
    data: {
      totalCount,
      report: Object.values(report),
      usersKey,
    },
  };
};
