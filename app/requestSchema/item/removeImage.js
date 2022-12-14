exports.removeImageSchema = {
  type: 'object',
  required: ['params', 'body'],
  properties: {
    body: {
      required: ['imageIndex'],
      properties: {
        imageIndex: {
          type: 'integer',
          minimum: 0,
          errorMessage: 'ER_INVALID_IMAGE_INDEX:Invalid imageIndex',
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
