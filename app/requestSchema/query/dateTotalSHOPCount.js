exports.dateTotalSHOPSchema = {
  type: 'object',
  required: ['query', 'params'],
  properties: {
    params: {
      type: 'object',
      required: ['shopId'],
      properties: {
        shopId: {
          type: 'string',
          errorMessage: 'ER_INVALID_SHOP_ID:Invalid shop id',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          shopId: 'ER_REQUIRED_SHOP_ID:shop id is required',
        },
      },
    },
    query: {
      type: 'object',
      required: ['from', 'to'],
      properties: {
        to: {
          type: 'string',
          format: 'date',
          errorMessage: 'ER_INVALID_TO:Invalid to',
        },
        from: {
          type: 'string',
          format: 'date',
          errorMessage: 'ER_INVALID_FROM:Invalid from',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          to: 'ER_REQUIRED_TO:to is required',
          from: 'ER_REQUIRED_FROM:from is required',
        },
      },
    },
    body: {},
  },
  errorMessage: {
    required: {
      query: 'ER_REQUIRED_QUERY:query is required',
      params: 'ER_REQUIRED_PARAMS:params is required',
    },
  },
};
