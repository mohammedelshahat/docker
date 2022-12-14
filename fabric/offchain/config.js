const { fabric, couchdb } = require('../../config');

const { channel } = fabric[fabric.env];
const { offchainUrl } = couchdb[fabric.env];

module.exports = {
  channelId: channel,
  useCouchdb: true,
  createHistoryLog: true,
  couchdbAddress: offchainUrl,
};
