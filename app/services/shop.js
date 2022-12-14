const _ = require("lodash");
const { contracts } = require("../../config");
const { submitTx, evaluateTx } = require("../../fabric");
const couchdb = require("../../utils/couchdb");
const { Pagination } = require("../../utils/pagination");
const db = require("../../models");
const env = process.env.FABRIC_ENV || "local";
const { channel } = require("../../config").fabric[env];

exports.create = async ({ body }) => {
  // check if customer code already exists
  const { err: evalKeyError, result: shopRecord } = await evaluateTx({
    chaincode: contracts.shop,
    txName: "getAssetIfExists",
    args: {
      key: body.customerCode,
    },
  });
  if (evalKeyError) return { err: evalKeyError, status: 417 };
  if (shopRecord)
    return {
      err: `shop with customer code:${body.customerCode} already exists`,
      status: 409,
    };

  const { err, result } = await submitTx({
    chaincode: contracts.shop,
    txName: "create",
    args: body,
  });
  if (err) return { err, status: 417 };
  await db.Shop.create({...result.Record, customerCode: body.customerCode});
  return {
    data: result,
    message: "shop created successfully",
  };
};

exports.getShopById = async ({ params }) => {
  const { customerCode } = params;

  const { err, result } = await evaluateTx({
    chaincode: contracts.shop,
    txName: "getAssetIfExists",
    args: {
      key: customerCode,
    },
  });
  if (err) return { err, status: 417 };
  if (result === false)
    return {
      err: `no shop found with customer code: ${customerCode}`,
      status: 404,
    };

  return {
    data: {
      Key: customerCode,
      Record: result,
    },
    message: "query successful",
  };
};

exports.update = async ({ params, body }) => {
  const { customerCode } = params;
  const { err: e, result } = await evaluateTx({
    chaincode: contracts.shop,
    txName: "assetExists",
    args: { key: customerCode },
  });
  if (e) return { err: e, status: 417 };
  if (!result) return { err: "no shop found with this key", status: 404 };

  const { err, result: shop } = await submitTx({
    chaincode: contracts.shop,
    txName: "update",
    args: { customerCode, ...body },
  });
  if (err) return { err, status: 417 };
  const shopsql = await db.Shop.findOne({ where: { customerCode }, raw: true });
    if(shopsql){
      delete shopsql.id;
      const mergeShop = {...shopsql, ...body};
      await db.Shop.update(mergeShop,{ where: { customerCode } });
    }
  return {
    data: shop,
    message: "shop updated successfully",
  };
};

exports.deleteShop = async ({ params }) => {
  const { customerCode } = params;
  const { err: e, result: found } = await evaluateTx({
    chaincode: contracts.shop,
    txName: "assetExists",
    args: { key: customerCode },
  });
  if (e) return { err: e, status: 417 };
  if (!found) return { err: "no shop found with this key", status: 404 };

  const { err, result } = await submitTx({
    chaincode: contracts.shop,
    txName: "delete",
    args: { key: customerCode },
  });
  if (err) return { err, status: 417 };
  await db.Shop.destroy({ where: { customerCode } });
  return {
    data: result,
    message: "shop deleted successfully",
  };
};

exports.getShops = async ({ query }) => {
  const { pageNumber } = query;

  const pagination = new Pagination(pageNumber);

  const baseUrl = `${channel}_${contracts.shop}/_design/report/_view/name?include_docs=true`;
  const url = `${baseUrl}&skip=${pagination.getOffset()}&limit=${
    pagination.pageSize
  }`;

  const { data, err, status } = await couchdb.get({ url });
  if (err) return { err, status };

  const count = _.get(data, ["total_rows"], 0);
  const rows = _.get(data, ["rows"], []);
  if (rows.length === 1 && rows[0].key === null) rows.pop();

  // reformat rows for convenience
  for (let i = 0; i < rows.length; i += 1) {
    const { doc } = rows[i];
    const { _id, _rev, ...Record } = doc;
    rows[i] = { Key: _id, Record };
  }

  return {
    message: "query successful",
    meta: pagination.getMetaData(count),
    data: rows,
  };
};
