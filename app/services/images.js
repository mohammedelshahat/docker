const { contracts } = require("../../config");
const { submitTx, evaluateTx } = require("../../fabric");
const { itemDynamicSchema } = require("./item");
const db = require("../../models");
exports.addItemImage = async ({ params, body }) => {
  const { itemKey } = params;
  const { image } = body;

  const { err: getErr, result: item } = await evaluateTx({
    chaincode: contracts.item,
    txName: "getAssetIfExists",
    args: { key: itemKey },
  });
  if (getErr) return { err: getErr, status: 417 };
  if (item === false)
    return { err: `no item found with id: ${itemKey}`, status: 404 };

  const images = item.images || [];
  images.push(image);

  const dynamicSchema = await itemDynamicSchema();

  const { err, result } = await submitTx({
    chaincode: contracts.item,
    txName: "update",
    args: { itemKey, images },
    dynamicSchema,
  });
  if (err) return { err, status: 417 };
  const itemsql = await db.Item.findOne({ where: { itemKey }, raw: true });
    if(itemsql){
      delete itemsql.id;
      itemsql.images = images;
      await db.Item.update(
        { ...itemsql, itemKey },
        { where: { itemKey } }
      );
    }
  return {
    data: result,
    message: "item images updated successfully",
  };
};

exports.removeItemImage = async ({ params, body }) => {
  const { itemKey } = params;
  const { imageIndex } = body;

  const { err: getErr, result: item } = await evaluateTx({
    chaincode: contracts.item,
    txName: "getAssetIfExists",
    args: { key: itemKey },
  });
  if (getErr) return { err: getErr, status: 417 };
  if (item === false)
    return { err: `no item found with id: ${itemKey}`, status: 404 };

  const images = item.images || [];
  if (!images[imageIndex])
    return { err: "no image found with this index", status: 400 };
  images.splice(imageIndex, 1);

  const dynamicSchema = await itemDynamicSchema();

  const { err, result } = await submitTx({
    chaincode: contracts.item,
    txName: "update",
    args: { itemKey, images },
    dynamicSchema,
  });
  if (err) return { err, status: 417 };
  const itemsql = await db.Item.findOne({ where: { itemKey }, raw: true });
  if(itemsql){
    delete itemsql.id;
    itemsql.images = result.Record.images;
    await db.Item.update(itemsql,{ where: { itemKey } });
  }
  return {
    data: result,
    message: "item images updated successfully",
  };
};
