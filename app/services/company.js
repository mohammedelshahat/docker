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
  const { err: evalKeyError, result: companyRecord } = await evaluateTx({
    chaincode: contracts.company,
    txName: "getAssetIfExists",
    args: {
      key: body.customerCode,
    },
  });
  if (evalKeyError) return { err: evalKeyError, status: 417 };
  if (companyRecord)
    return {
      err: `company with customer code:${body.customerCode} already exists`,
      status: 409,
    };

  const { err, result } = await submitTx({
    chaincode: contracts.company,
    txName: "create",
    args: body,
  });
  if (err) return { err, status: 417 };
  await db.Company.create({...result.Record, customerCode:body.customerCode});
  return {
    data: result,
    message: "company created successfully",
  };
};

exports.getCompanyById = async ({ params }) => {
  const { customerCode } = params;

  const { err, result } = await evaluateTx({
    chaincode: contracts.company,
    txName: "getAssetIfExists",
    args: {
      key: customerCode,
    },
  });
  if (err) return { err, status: 417 };
  if (result === false)
    return {
      err: `no company found with customer code: ${customerCode}`,
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
    chaincode: contracts.company,
    txName: "assetExists",
    args: { key: customerCode },
  });
  if (e) return { err: e, status: 417 };
  if (!result) return { err: "no company found with this key", status: 404 };

  const { err, result: company } = await submitTx({
    chaincode: contracts.company,
    txName: "update",
    args: { customerCode, ...body },
  });
  if (err) return { err, status: 417 };
  await db.Company.update({...company.Record}, { where: { customerCode } });
  return {
    data: company,
    message: "company updated successfully",
  };
};

exports.deleteCompany = async ({ params }) => {
  const { customerCode } = params;
  const { err: e, result: found } = await evaluateTx({
    chaincode: contracts.company,
    txName: "assetExists",
    args: { key: customerCode },
  });
  if (e) return { err: e, status: 417 };
  if (!found)
    return { err: "no company found with this customer code", status: 404 };

  const { err, result } = await submitTx({
    chaincode: contracts.company,
    txName: "delete",
    args: { key: customerCode },
  });
  if (err) return { err, status: 417 };
  await db.Company.destroy({ where: { customerCode } });
  return {
    data: result,
    message: "company deleted successfully",
  };
};

exports.getCompanies = async ({ query }) => {
  const { pageNumber } = query;

  const pagination = new Pagination(pageNumber);

  const baseUrl = `${channel}_${contracts.company}/_design/report/_view/name?include_docs=true`;
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
