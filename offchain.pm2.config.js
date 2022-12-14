module.exports = {
  apps: [{
    name: 'offchain',
    script: 'fabric/offchain/blockEventListener.js',
    env: {
      DEBUG: 'app*',
    },
    time: true,
  }],
};
