const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const debug = require('debug')('app:fabric:connect');
const { fabric, contracts } = require('../config');

const fabricConfig = fabric[fabric.env];
if (!fabricConfig) throw new Error('please specify fabric environment by setting FABRIC_ENV in .env file');

const applicationUserId = fabric.user;
const walletPath = path.join(__dirname, 'secure', 'wallet');

const connection = {
  loading: false,
};

async function connect() {
  // load the network configuration
  debug('creating new standalone connection');
  const ccpPath = path.resolve(__dirname, 'secure', fabricConfig.connectionProfile);
  const fileExists = fs.existsSync(ccpPath);
  if (!fileExists) throw new Error(`no such file or directory: ${ccpPath}`);
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const userIdentity = await wallet.get(applicationUserId);
  if (!userIdentity) throw new Error(`no identity found for user:${applicationUserId}`);

  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: applicationUserId,
    discovery: { enabled: true, asLocalhost: fabricConfig.asLocalhost },
    eventHandlerOptions: {
      strategy: null,
    },
  });

  const network = await gateway.getNetwork(fabricConfig.channel);

  // initLedger transaction fix
  // enable chaincode discovery to establish connection with chaincode
  const contract1 = network.getContract(contracts.item);
  const contract2 = network.getContract(contracts.shop);
  const contract3 = network.getContract(contracts.company);
  const contract4 = network.getContract(contracts.citizen);
  const contract5 = network.getContract(contracts.history);
  await Promise.all([
    contract1.getDiscoveryHandler(),
    contract2.getDiscoveryHandler(),
    contract3.getDiscoveryHandler(),
    contract4.getDiscoveryHandler(),
    contract5.getDiscoveryHandler(),
  ]);

  return { gateway, network };
}
exports.standaloneConnection = connect;

exports.createConnection = async () => {
  if (connection.loading) {
    debug('can\'t create connection: connection loading');
    return false;
  }
  connection.loading = true;
  const { gateway, network } = await connect();
  connection.gateway = gateway;
  connection.network = network;
  debug('connected to fabric successfully');
  connection.loading = false;
  return connection;
};

exports.restartConnection = async () => {
  if (connection.loading) {
    debug('can\'t restart connection: connection loading');
    return false;
  }
  connection.loading = true;
  const { gateway, network } = await connect();
  connection.gateway = gateway;
  connection.network = network;
  debug('restarted connecting successfully');
  connection.loading = false;
  return true;
};
