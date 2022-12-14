const _ = require('lodash');

exports.ServerError = class ServerError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
};

exports.customAssign = (target, source) => {
  if (typeof target !== 'object' || typeof source !== 'object') {
    throw new Error('target and source should be of type objects');
  }
  const filteredSource = _.omitBy(source, _.isNil);
  Object.assign(target, filteredSource);
  return target;
};
