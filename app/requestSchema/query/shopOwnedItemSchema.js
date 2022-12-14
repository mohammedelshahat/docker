exports.shopItemsSchema = {
  type: 'object',
  required: ['params'],
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
          errorMessage: 'ER_INVALID_SHOP_ID:Invalid shop id',
        },
      },
    },
    query: {},
    body: {},
  },
  errorMessage: {
    required: {
      params: 'ER_REQUIRED_QUERY:query is required',
    },
  },
};
