const _ = require('lodash');
const Ajv = require('ajv');
// const { ServerError } = require('../../utils/core');

const ajv = new Ajv({ allErrors: true, jsonPointers: true, useDefaults: true });
require('ajv-errors')(ajv, { singleError: true });

const validate = (schema) => (req, res, next) => {
  let { body, params, query } = req;
  const validateSchema = ajv.compile(schema);
  body = _.omitBy(body, _.isNil);
  params = _.omitBy(params, _.isNil);
  query = _.omitBy(query, _.isNil);
  const valid = validateSchema({ body, params, query });
  if (valid) {
    Object.assign(req, { body, params, query });
    return next();
  }
  /**
   * split error message to code and message
   * error examples:
   *   'ER_INVALID_ORIGIN:Invalid origin'
   *   'Item should not have additional properties'
   * if the message can be split successfully to two elements
   * we reverse the array for the message to be the first element.
   * this way if the error cannot be split into code and message, the first element
   * of the array will contain the original error.
   */
  // filter empty errors
  const errs = validateSchema.errors.filter((err) => err.message);
  const [message, code] = errs[0].message.split(':').reverse();
  return res.status(400).json({
    message,
    code: code || 'ER_VALIDATION',
  });
};

module.exports = { validate };
