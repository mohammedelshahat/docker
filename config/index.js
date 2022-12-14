const dotenv = require('dotenv');

const envFound = dotenv.config();
if (!envFound) {
  throw new Error(' Couldn\'t find .env file!');
}

module.exports = {
  port: parseInt(process.env.PORT, 10),
  api: {
    prefix: '/',
  },
  couchdb: {
    local: {
      url: process.env.COUCHDB_URL,
      offchainUrl: process.env.OFFCHAIN_COUCHDB_URL,
    },
    remote: {
      url: process.env.REMOTE_COUCHDB_URL,
      offchainUrl: process.env.REMOTE_OFFCHAIN_COUCHDB_URL,
    },
  },
  fabric: {
    env: process.env.FABRIC_ENV,
    admin: process.env.FABRIC_ADMIN,
    adminPassword: process.env.FABRIC_ADMIN_PASSWORD,
    user: process.env.FABRIC_USER,
    local: {
      channel: 'mychannel',
      asLocalhost: true,
      connectionProfile: 'connection-org1.json',
      caIdentifier: 'ca.org1.example.com',
      mspId: 'Org1MSP',
      userAffiliation: 'org1.department1',
      userAttrs: [],
    },
    remote: {
      channel: 'channel1',
      asLocalhost: false,
      connectionProfile: 'org1msp_profile.json',
      caIdentifier: 'ibp-network-org1ca-ca.apps.ocp.intercom.com.eg:443',
      mspId: 'org1msp',
      userAffiliation: 'ibp',
      userAttrs: [{
        name: 'hf.Revoker',
        value: 'true',
      }],
    },
  },
  serverUrl: process.env.SERVER_URL,
  roles: {
    citizen: 'citizen',
    company: 'company',
    shop: 'shop',
  },
  contracts: {
    citizen: 'citizen',
    company: 'company',
    shop: 'shop',
    item: 'item',
    history: 'history',
  },
  pagination: {
    pageSize: 20,
  },
};
