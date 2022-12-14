exports.addImageSchema = {
  type: 'object',
  required: ['params', 'body'],
  properties: {
    body: {
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_IMAGE:Invalid image',
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
