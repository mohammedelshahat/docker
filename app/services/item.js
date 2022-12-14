const _ = require("lodash");
const { contracts } = require("../../config");
const { evaluateTx, submitTx } = require("../../fabric");
const { getCitizen } = require("./citizen");
const db = require("../../models");
const couchdb = require("../../utils/couchdb");
const { Pagination } = require("../../utils/pagination");

const env = process.env.FABRIC_ENV || "local";
const { channel } = require("../../config").fabric[env];

async function getOwner(ownerId, ownerType) {
  if (ownerType === "CTZN") {
    const { err, status, citizen } = await getCitizen(ownerId);
    if (err) return { err, status };
    return { owner: citizen };
  }
  let contract;
  if (ownerType === "CMPNY") contract = contracts.company;
  if (ownerType === "SHOP") contract = contracts.shop;

  const { err, result } = await evaluateTx({
    chaincode: contract,
    txName: "getAssetIfExists",
    args: { key: ownerId },
  });
  if (err) return { err, status: 417 };
  if (result === false)
    return { err: `no ${contract} found with id: ${ownerId}`, status: 404 };
  return { owner: { Key: ownerId, Record: result } };
}
exports.getOwner = getOwner;

exports.create = async ({ body, dynamicSchema }) => {
  const { itemParentId } = body;

  // check if itemCode entered already exists
  const { itemCode } = body;
  if (itemCode) {
    const { err, result } = await evaluateTx({
      chaincode: contracts.item,
      txName: "getAssetIfExists",
      args: { key: itemCode },
    });
    if (err) return { err, status: 417 };
    if (result !== false)
      return { err: `item with code: ${itemCode} already exists`, status: 409 };
  }

  const { err, result: item } = await submitTx({
    chaincode: contracts.item,
    txName: "newCreate",
    args: body,
    dynamicSchema,
  });
  if (err) return { err, status: 417 };
  await db.Item.create({...item.Record, itemKey: item.Key});
  // change parent isParent to true in a separate tx to avoid MVCC conflict
  // update: changing isParent in a different tx still causes a MVCC Read conflict
  // when block number gets high: 1000~1400
  if (itemParentId) {
    submitTx({
      chaincode: contracts.item,
      txName: "update",
      args: { itemKey: itemParentId, isParent: true },
      dynamicSchema,
    });
    await db.Item.update({...item.Record, itemKey: itemParentId}, { where: { itemKey: itemParentId } });
  }
  return {
    data: item,
    message: "item created successfully",
  };
};

exports.createWithCitizen = async ({ body, dynamicSchema }) => {
  const { item, citizen } = body;

  // check if itemCode entered already exists
  const { itemCode } = item;
  if (itemCode) {
    const { err, result } = await evaluateTx({
      chaincode: contracts.item,
      txName: "getAssetIfExists",
      args: { key: itemCode },
    });
    if (err) return { err, status: 417 };
    if (result !== false)
      return { err: `item with code: ${itemCode} already exists`, status: 409 };
  }

  let ownerId = null;
  const ownerType = "CTZN";

  const { citizenNationalId, passportNumber } = citizen;

  // check if national id already exists
  const { err: evalNIDError, result: NIDRecord } = await evaluateTx({
    chaincode: contracts.citizen,
    txName: "getAssetIfExists",
    args: {
      key: `NID_${citizenNationalId}`,
    },
  });
  if (evalNIDError) return { err: evalNIDError, status: 417 };
  // check if passport already exists
  const { err: evalPassportError, result: passportRecord } = await evaluateTx({
    chaincode: contracts.citizen,
    txName: "getAssetIfExists",
    args: {
      key: `PASSPORT_${passportNumber}`,
    },
  });
  if (evalPassportError) return { err: evalPassportError, status: 417 };

  if (NIDRecord) ownerId = _.get(NIDRecord, ["key"], null);
  else if (passportRecord) ownerId = _.get(passportRecord, ["key"], null);
  else {
    const { err, result: newCitizen } = await submitTx({
      chaincode: contracts.citizen,
      txName: "create",
      args: citizen,
    });
    if (err) return { err, status: 417 };
    await db.Citizen.create({...newCitizen.Record});
    ownerId = newCitizen.Key;
  }

  Object.assign(item, { ownerId, ownerType });

  const { err, result } = await submitTx({
    chaincode: contracts.item,
    txName: "create",
    args: item,
    dynamicSchema,
  });
  if (err) return { err, status: 417 };
  await db.Item.create({...result.Record, itemKey: result.Key});
  return {
    data: result,
    message: "item created successfully",
  };
};

exports.transferOwnership = async ({ params, query: requestQuery }) => {
  const { itemKey } = params;
  const { newOwnerId, newOwnerType, weight } = requestQuery;

  const { err, result: item } = await submitTx({
    chaincode: contracts.item,
    txName: "transferOwnership",
    // we parse weight to a number as all query parameters are strings
    args: {
      itemKey,
      ownerId: newOwnerId,
      ownerType: newOwnerType,
      weight: +weight,
    },
  });
  if (err) return { err, status: 417 };
  const itemsql = await db.Item.findOne({ where: { itemKey: item.Key }, raw: true });
  if(itemsql){
    delete itemsql.id;
    itemsql.ownerId = newOwnerId;
    itemsql.ownerType = newOwnerType;
    itemsql.weight = +weight;
    itemsql.images = item.Record.images
    await db.Item.update(itemsql, { where: { itemKey: item.Key } });
  }
  else
    await db.Item.create({...item.Record, itemKey: item.Key});
  return {
    data: item,
    message: "item transferred successfully",
  };
};

exports.changeStatus =
  (status) =>
  async ({ params, body }) => {
    const { itemKey } = params;
    const { remark: description } = body;
    const { err: e, result } = await evaluateTx({
      chaincode: contracts.item,
      txName: "assetExists",
      args: { key: itemKey },
    });
    if (e) return { err: e, status: 417 };
    if (!result) return { err: "no item found with this key", status: 404 };

    const dynamicSchema = await this.itemDynamicSchema();

    const { err, result: item } = await submitTx({
      chaincode: contracts.item,
      txName: "update",
      args: { itemKey, itemStatus: status, description },
      dynamicSchema,
    });
    if (err) return { err, status: 417 };
    const itemsql = await db.Item.findOne({ where: { itemKey }, raw: true });
    if(itemsql){
      delete itemsql.id;
      itemsql.itemStatus = status;
      itemsql.description = description?description:itemsql.description;
      itemsql.images = item.Record.images
      await db.Item.update(
        { ...itemsql, itemKey },
        { where: { itemKey } }
      );
    }
    return {
      data: item,
      message: "item status updated successfully",
    };
  };

exports.getItemById = async ({ params }) => {
  const { itemKey } = params;

  const { err, result } = await evaluateTx({
    chaincode: contracts.item,
    txName: "getAssetIfExists",
    args: { key: itemKey },
  });
  if (err) return { err, status: 417 };
  if (result === false)
    return { err: `no item found with id: ${itemKey}`, status: 404 };

  if (result.itemParentId) {
    const { err: pErr, result: parent } = await evaluateTx({
      chaincode: contracts.item,
      txName: "getAssetIfExists",
      args: { key: result.itemParentId },
    });
    if (pErr) return { err: pErr, status: 417 };
    result.ownerId = parent.ownerId;
    result.ownerType = parent.ownerType;
  }

  return {
    data: {
      Key: itemKey,
      Record: result,
    },
    message: "query successful",
  };
};

exports.itemDynamicSchema = async () => {
  const enums = await db.Enum.findAll({
    where: { chaincode: contracts.item },
    attributes: ["name", "errorMessage"],
    include: [
      {
        model: db.Lookup,
        attributes: ["code"],
        required: false,
      },
    ],
  });
  const schema = {};
  // eslint-disable-next-line array-callback-return
  enums.map((e) => {
    const lookups = e.Lookups.map((l) => l.code);
    schema[e.name] = {
      type: "string",
      errorMessage: e.errorMessage,
      enum: lookups,
    };
  });
  return schema;
};

exports.getAllItems = async ({ query }) => {
  const { pageNumber } = query;

  const pagination = new Pagination(pageNumber);

  const baseUrl = `${channel}_${contracts.item}/_design/assets/_view/items`;
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
    const { _id, _rev, ...Record } = value;
    rows[i] = { Key: _id, Record };
  }

  return {
    message: "query successful",
    meta: pagination.getMetaData(count),
    data: rows,
  };
};
