exports.getTransferSchema = {
  type: 'object',
  required: ['query'],
  properties: {
    body: {},
    query: {
      required: ['fromDate', 'toDate'],
      properties: {
        fromDate: {
          type: 'string',
          format: 'date-time',
          errorMessage: 'ER_INVALID_FROM_DATE:Invalid fromDate',
        },
        toDate: {
          type: 'string',
          format: 'date-time',
          errorMessage: 'ER_INVALID_TO_DATE:Invalid toDate',
        },
        fromOwner: {
          type: 'string',
          errorMessage: 'ER_INVALID_FROM_OWNER:Invalid fromOwner',
        },
        toOwner: {
          type: 'string',
          errorMessage: 'ER_INVALID_TO_OWNER:Invalid toOwner',
        },
        fromType: {
          type: 'string',
          enum: ['CTZN', 'CMPNY', 'SHOP'],
          default: 'CTZN',
          errorMessage: 'ER_INVALID_OWNER_TYPE:Invalid Owner Type',
        },
        toType: {
          type: 'string',
          enum: ['CTZN', 'CMPNY', 'SHOP'],
          default: 'CTZN',
          errorMessage: 'ER_INVALID_OWNER_TYPE:Invalid Owner Type',
        },
      },
      anyOf: [{
        required: ['fromOwner'],
      }, {
        required: ['toOwner'],
      }],
      additionalProperties: false,
      errorMessage: {
        required: {
          fromDate: 'ER_REQUIRED_FROM_DATE:fromDate is required',
          toDate: 'ER_REQUIRED_TO_DATE:toDate is required',
        },
        anyOf: 'ER_REQUIRED_OWNER:fromOwner or toOwner is required',
      },
    },
    params: {},
  },
};
