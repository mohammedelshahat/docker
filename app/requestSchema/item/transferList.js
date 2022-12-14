exports.transferListSchema = {
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
            required: ['itemKey', 'weight'],
            properties: {
              itemKey: {
                type: 'string',
                minLength: 6,
                maxLength: 10,
                errorMessage: 'ER_INVALID_ITEM_KEY:Invalid Item key',
              },
              weight: {
                type: 'number',
                errorMessage: 'ER_INVALID_WEIGHT:Invalid Weight',
              },
            },
            additionalProperties: false,
            errorMessage: {
              required: {
                itemKey: 'ER_REQUIRED_ITEM_KEY:Item key is required',
                weight: 'ER_REQUIRED_WEIGHT:weight is required',
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
    query: {
      required: [
        'newOwnerId',
        'newOwnerType',
      ],
      properties: {
        newOwnerId: {
          type: 'string',
          errorMessage: 'ER_INVALID_NEW_OWNER_NATIONAL_ID:Invalid New owner id',
        },
        newOwnerType: {
          type: 'string',
          enum: ['CTZN', 'CMPNY', 'SHOP'],
          errorMessage: 'ER_INVALID_NEW_OWNER_TYPE:Invalid New owner type',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          newOwnerId: 'ER_REQUIRED_NEW_OWNER_ID:New owner Id is required',
          newOwnerType: 'ER_REQUIRED_NEW_OWNER_TYPE:New owner type is required',
        },
      },
    },
    params: {},
  },
};
