const { contracts } = require('../../config');
const { submitTx, query } = require('../../fabric');
const { itemDynamicSchema, getOwner } = require('./item');
const db = require("../../models");
// TODO: validation to avoid read MVCC conflict
exports.transferList = async ({ body, query: requestQuery }) => {
  const { items } = body;
  const { newOwnerId, newOwnerType } = requestQuery;

  const { err: getErr, status, owner } = await getOwner(newOwnerId, newOwnerType);
  if (getErr) return { err: getErr, status };

  const res = await Promise.allSettled(items.map(async (item) => {
    const { itemKey, weight } = item;
    const { err, result } = await submitTx({
      chaincode: contracts.item,
      txName: 'transferOwnership',
      args: { itemKey, ownerId: owner.Key, ownerType: newOwnerType, weight: +weight },
    });
    if (err) return { err, itemKey };
    const itemsql = await db.Item.findOne({ where: { itemKey }, raw: true });
    if(itemsql){
      delete itemsql.id;
      itemsql.ownerId = owner.Key;
      itemsql.ownerType = newOwnerType;
      itemsql.weight = +weight;
      itemsql.images = result.Record.images;
      await db.Item.update({ ...itemsql }, { where:{ itemKey} }).catch(err=>console.log(err.message));
    }
    else
      await db.Item.create({...result.Record, itemKey});
    return { result };
  }));
  const data = await res.map(async (p) => {
    const { value } = p;
    if (value.err) {
      return {
        status: 'failed',
        itemKey: value.itemKey,
        err: value.err,
      };
    }
    return {
      status: 'success',
      data: value.result,
    };
  });
  return {
    data,
    message: 'transfer by list done',
  };
};

exports.getRelatedItems = async ({ params }) => {
  const { itemKey } = params;

  const [item] = await query({
    chaincode: contracts.item,
    selector: { _id: itemKey },
  });
  if (!item) return { err: `no item found with id: ${itemKey}`, status: 404 };

  const queryKey = item.Record.itemParentId || item.Key;
  const items = await query({
    chaincode: contracts.item,
    selector: {
      $or: [{
        _id: queryKey,
      }, {
        itemParentId: queryKey,
      }],
    },
  });

  return {
    data: items,
    message: 'query successful',
  };
};

exports.changeListStatus = (status) => async ({ body }) => {
  const { items } = body;
  const dynamicSchema = await itemDynamicSchema();
  const res = await Promise.allSettled(items.map(async (item) => {
    const { itemKey, remark: description } = item;
    const { err, result } = await submitTx({
      chaincode: contracts.item,
      txName: 'update',
      args: { itemKey, itemStatus: status, description },
      dynamicSchema,
    });
    if (err) return { err, itemKey };
    const itemsql = await db.Item.findOne({ where: { itemKey }, raw: true });
    if(itemsql){
      delete itemsql.id;
      itemsql.itemStatus = status;
      itemsql.description = description?description:itemsql.description;
      itemsql.images = result.Record.images
      await db.Item.update(
        { ...itemsql, itemKey },
        { where: { itemKey } }
      );
    }
    return { result };
  }));
  const data = res.map((p) => {
    const { value } = p;
    if (value.err) {
      return {
        status: 'failed',
        itemKey: value.itemKey,
        err: value.err,
      };
    }
    return {
      status: 'success',
      data: value.result,
    };
  });
  return {
    data,
    message: 'change status by list done',
  };
};
