const _ = require("lodash");
const { contracts } = require("../../config");
const { query } = require("../../fabric");
const couchdb = require("../../utils/couchdb");
const { Pagination } = require("../../utils/pagination");

const env = process.env.FABRIC_ENV || "local";
const { channel } = require("../../config").fabric[env];

exports.getTransfer = async ({ query: reqQuery }) => {
  const { fromDate, toDate, fromOwner, toOwner, fromType, toType } = reqQuery;

  const minDate = new Date(fromDate).getTime();
  if (Number.isNaN(minDate))
    return { err: "ER_INVALID_FROM_DATE:Invalid fromDate", status: 400 };
  const maxDate = new Date(toDate).getTime();
  if (Number.isNaN(maxDate))
    return { err: "ER_INVALID_TO_DATE:Invalid toDate", status: 400 };

  const transfers = await query({
    chaincode: contracts.history,
    selector: {
      createdAt: {
        $gte: (minDate / 1000).toString(),
        $lt: (maxDate / 1000).toString(),
      },
      from: fromOwner,
      to: toOwner,
      fromType,
      toType,
      docType: "transfer",
    },
  });

  return {
    data: transfers,
    message: "query successful",
  };
};

exports.getAllTransfers = async ({ query: reqQuery }) => {
  const { pageNumber } = reqQuery;

  const pagination = new Pagination(pageNumber);

  const baseUrl = `${channel}_${contracts.item}/_design/assets/_view/transfer`;
  const url = `${baseUrl}?limit=${
    pagination.pageSize
  }&skip=${pagination.getOffset()}`;

  const { data, err, status } = await couchdb.get({ url });
  if (err) return { err, status };

  const count = _.get(data, ["total_rows"], 0);
  const rows = _.get(data, ["rows"], []);

  // reformat rows for convenience
  for (let i = 0; i < rows.length; i += 1) {
    const { value } = rows[i];
    const { _id, to, toType } = value;
    rows[i] = {
      Key: _id,
      Record: {
        newOwnerId: to,
        newOwnerType: toType,
      },
    };
  }

  return {
    message: "query successful",
    meta: pagination.getMetaData(count),
    data: rows,
  };
};
