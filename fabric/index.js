const _ = require('lodash');
const debug = require('debug')('app:fabric');
const { fabric } = require('../config');
const { createConnection, restartConnection, standaloneConnection } = require('./connect');

const fabricConfig = fabric[fabric.env];
if (!fabricConfig) throw new Error('please specify fabric environment by setting FABRIC_ENV in .env file');

let connection = {};

// connect to fabric on startup
(async () => {
  connection = await createConnection();
})();

exports.getNetwork = async () => {
  let { network } = connection;
  // restart connection if not running
  if (!network) {
    // we don't need to wait for connection to restart
    restartConnection();
    const { network: newNetwork } = await standaloneConnection();
    network = newNetwork;
  }

  return network;
};

async function getChaincode(chaincode) {
  let connected = true;
  let { network } = connection;

  if (!network) connected = false;
  else {
    try {
      // check contract exists
      const contract = network.getContract(chaincode);

      // check query handler connection
      const peers = network.queryHandler.peers || [];
      let peersConnected = false;
      for (let i = 0; i < peers.length; i += 1) {
        if (peers[i].connected) {
          peersConnected = true;
          debug(`connected to query handler peer: ${peers[i].name}`);
        }
      }
      if (!peersConnected) {
        connected = false;
      }

      // check endorsing peers connections
      const discoveryHandler = await contract.getDiscoveryHandler();
      let currentTarget;
      if (discoveryHandler.discoveryService) {
        currentTarget = discoveryHandler.discoveryService.currentTarget;
      } else {
        currentTarget = discoveryHandler.discovery.currentTarget;
      }
      if (!currentTarget || !currentTarget.connected) connected = false;
      else debug(`connected to endorser peer: ${currentTarget.name}`);

      // endorsers check second plan
      // const s = network.getChannel().getEndorsers();
      // console.log(s);
      // console.log(s[0].connected);
    } catch (error) {
      connected = false;
    }
  }

  // restart connection if not running
  if (!connected) {
    // we don't need to wait for connection to restart
    restartConnection();
    const { network: newNetwork } = await standaloneConnection();
    debug('created new standalone connection');
    network = newNetwork;
  }

  const contract = network.getContract(chaincode);
  if (!contract) throw new Error(`chaincode:${chaincode} not found`);
  return contract;
}

exports.submitTx = async ({ chaincode, txName, args, dynamicSchema }) => {
  const contract = await getChaincode(chaincode);
  try {
    const input = [txName, JSON.stringify(args)];
    if (dynamicSchema) input.push(JSON.stringify(dynamicSchema));
    const result = await contract.submitTransaction(...input);
    return { result: JSON.parse(result) };
  } catch (err) {
    debug(err);
    const msg = _.get(err, ['responses', '0', 'response', 'message'], 'transaction failed');
    return { err: msg };
  }
};

exports.evaluateTx = async ({ chaincode, txName, args }) => {
  const contract = await getChaincode(chaincode);
  try {
    const result = await contract.evaluateTransaction(txName, JSON.stringify(args));
    return { result: JSON.parse(result) };
  } catch (err) {
    debug(err);
    return { err: err.toString() };
  }
};

exports.query = async ({ chaincode, selector }) => {
  const contract = await getChaincode(chaincode);
  const result = await contract.evaluateTransaction('query', JSON.stringify({
    // eslint-disable-next-line object-shorthand
    query: JSON.stringify({ selector: selector }),
  }));
  return JSON.parse(result);
};
