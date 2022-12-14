exports.getByIdSchema = {
  type: 'object',
  required: [
    'params',
  ],
  properties: {
    body: {},
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
