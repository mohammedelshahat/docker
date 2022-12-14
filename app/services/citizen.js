const _ = require("lodash");
const { contracts } = require("../../config");
const { submitTx, evaluateTx } = require("../../fabric");
const couchdb = require("../../utils/couchdb");
const { Pagination } = require("../../utils/pagination");
const db = require("../../models");
const env = process.env.FABRIC_ENV || "local";
const { channel } = require("../../config").fabric[env];

async function getCitizen(id) {
  // try to get citizen by NID, passport or id
  const [idRecord, NIDRecord, passportRecord] = await Promise.all([
    evaluateTx({
      chaincode: contracts.citizen,
      txName: "getAssetIfExists",
      args: { key: id },
    }),
    evaluateTx({
      chaincode: contracts.citizen,
      txName: "getAssetIfExists",
      args: { key: `NID_${id}` },
    }),
    evaluateTx({
      chaincode: contracts.citizen,
      txName: "getAssetIfExists",
      args: { key: `PASSPORT_${id}` },
    }),
  ]);

  if (passportRecord.err) return { err: passportRecord.err, status: 417 };
  if (NIDRecord.err) return { err: NIDRecord.err, status: 417 };
  if (idRecord.err) return { err: idRecord.err, status: 417 };

  if (idRecord.result !== false) {
    return { citizen: { Key: id, Record: idRecord.result } };
  }

  let citizenKey = false;
  if (passportRecord.result !== false)
    citizenKey = _.get(passportRecord, ["result", "key"], false);
  if (NIDRecord.result !== false)
    citizenKey = _.get(NIDRecord, ["result", "key"], false);

  if (citizenKey === false)
    return { err: `no citizen found with id: ${id}`, status: 404 };

  const { err, result } = await evaluateTx({
    chaincode: contracts.citizen,
    txName: "getAssetIfExists",
    args: { key: citizenKey },
  });
  if (err) return { err, status: 417 };

  return { citizen: { Key: citizenKey, Record: result } };
}
exports.getCitizen = getCitizen;

exports.create = async ({ body }) => {
  const { citizenNationalId, passportNumber } = body;

  // check if national id already exists
  const { err: evalNIDError, result: NIDRecord } = await evaluateTx({
    chaincode: contracts.citizen,
    txName: "getAssetIfExists",
    args: {
      key: `NID_${citizenNationalId}`,
    },
  });
  if (evalNIDError) return { err: evalNIDError, status: 417 };
  if (NIDRecord)
    return {
      err: `citizen with national id:${citizenNationalId} already exists`,
      status: 409,
    };

  // check if passport already exists
  const { err: evalPassportError, result: passportRecord } = await evaluateTx({
    chaincode: contracts.citizen,
    txName: "getAssetIfExists",
    args: {
      key: `PASSPORT_${passportNumber}`,
    },
  });
  if (evalPassportError) return { err: evalPassportError, status: 417 };
  if (passportRecord)
    return {
      err: `citizen with passport:${passportNumber} already exists`,
      status: 409,
    };

  const { err, result: citizen } = await submitTx({
    chaincode: contracts.citizen,
    txName: "create",
    args: body,
  });
  if (err) return { err, status: 417 };
  await db.Citizen.create({...citizen.Record});
  return {
    data: citizen,
    message: "citizen created successfully",
  };
};

exports.getCitizenById = async ({ params }) => {
  const { citizenId } = params;

  // try to get citizen by NID, passport or id
  const { err, status, citizen } = await getCitizen(citizenId);
  if (err) return { err, status };

  return {
    data: citizen,
    message: "query successful",
  };
};

exports.update = async ({ params, body }) => {
  const { citizenId } = params;
  const { passportNumber } = body;

  // try to get citizen by NID, passport or id
  const {
    err: getErr,
    status,
    citizen: foundCitizen,
  } = await getCitizen(citizenId);
  if (getErr) return { err: getErr, status };

  if (passportNumber) {
    // check if passport already exists
    const { err: evalPassportError, result: passportRecord } = await evaluateTx(
      {
        chaincode: contracts.citizen,
        txName: "getAssetIfExists",
        args: {
          key: `PASSPORT_${passportNumber}`,
        },
      }
    );
    if (evalPassportError) return { err: evalPassportError, status: 417 };
    if (passportRecord)
      return {
        err: `citizen with passport:${passportNumber} already exists`,
        status: 409,
      };
  }

  const { err, result: citizen } = await submitTx({
    chaincode: contracts.citizen,
    txName: "update",
    args: { citizenId: foundCitizen.Key, ...body },
  });
  if (err) return { err, status: 417 };
  const citizensql = await db.Citizen.findOne({ where: { citizenNationalId: citizenId }, raw: true });
  if(citizensql)
      await db.Citizen.update({...citizen.Record}, { where: { citizenNationalId: citizenId} });
  else
    await db.Citizen.create({...citizen.Record});

  return {
    data: citizen,
    message: "citizen updated successfully",
  };
};

exports.deleteCitizen = async ({ params }) => {
  const { citizenId } = params;

  // try to get citizen by NID, passport or id
  const { err: getErr, status, citizen } = await getCitizen(citizenId);
  if (getErr) return { err: getErr, status };

  const { err, result } = await submitTx({
    chaincode: contracts.citizen,
    txName: "delete",
    args: { key: citizen.Key },
  });
  if (err) return { err, status: 417 };

  // delete NID query asset
  const { citizenNationalId, passportNumber } = result;
  if (citizenNationalId) {
    const { err: deleteErr } = await submitTx({
      chaincode: contracts.citizen,
      txName: "delete",
      args: { key: `NID_${citizenNationalId}` },
    });
    if (deleteErr) return { err: deleteErr, status: 417 };
  }
  if (passportNumber) {
    const { err: deleteErr } = await submitTx({
      chaincode: contracts.citizen,
      txName: "delete",
      args: { key: `PASSPORT_${passportNumber}` },
    });
    if (deleteErr) return { err: deleteErr, status: 417 };
  }
  await db.Citizen.destroy({ where: { citizenNationalId: citizenId } });
  return {
    data: result,
    message: "citizen deleted successfully",
  };
};

exports.getCitizens = async ({ query }) => {
  const { pageNumber } = query;

  const pagination = new Pagination(pageNumber);

  const baseUrl = `${channel}_${contracts.citizen}/_design/report/_view/name?include_docs=true`;
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
