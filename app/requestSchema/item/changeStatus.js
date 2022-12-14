exports.statusSchema = {
  type: 'object',
  required: [
    'params',
  ],
  properties: {
    body: {
      properties: {
        remark: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          errorMessage: 'ER_INVALID_REMARK:Invalid remark',
        },
      },
      additionalProperties: false,
    },
    params: {
      required: ['itemKey'],
      properties: {
        itemKey: {
          type: 'string',
          minLength: 6,
          maxLength: 10,
          errorMessage: 'ER_INVALID_ITEM_KEY:Invalid Item key',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          itemKey: 'ER_REQUIRED_ITEM_KEY:Item key is required',
        },
      },
    },
    query: {},
  },
};
