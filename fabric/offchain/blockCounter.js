const db = require('../../models');

exports.getNextBlock = async () => {
  const block = await db.Params.findOne({ where: { id: 1 }, raw: true });
  const { offchain } = block;

  return offchain;
};

exports.setNextBlock = async (blockNumber) => {
  await db.Params.update({ offchain: blockNumber }, { where: { id: 1 } });
  return true;
};
