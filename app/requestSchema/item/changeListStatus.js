exports.changeListSchema = {
  type: 'object',
  required: [
    'body',
  ],
  properties: {
    body: {
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['itemKey'],
            properties: {
              itemKey: {
                type: 'string',
                minLength: 6,
                maxLength: 10,
                errorMessage: 'ER_INVALID_ITEM_KEY:Invalid Item key',
              },
              remark: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
                errorMessage: 'ER_INVALID_REMARK:Invalid remark',
              },
            },
            additionalProperties: false,
            errorMessage: {
              required: {
                itemKey: 'ER_REQUIRED_ITEM_KEY:Item key is required',
              },
            },
          },
          errorMessage: 'ER_INVALID_ITEMS_LIST:Invalid Items list',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          items: 'ER_REQUIRED_ITEMS:Items is required',
        },
      },
    },
    query: {},
    params: {},
  },
};
