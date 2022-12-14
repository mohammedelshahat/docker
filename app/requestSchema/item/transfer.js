exports.transferSchema = {
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
    query: {
      required: [
        'newOwnerId',
        'newOwnerType',
        'weight',
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
        weight: {
          // we need to use regex to validate weight to be a float
          // as all query parameters are strings
          type: 'string',
          pattern: '^[0-9]*\\.?[0-9]*$',
          errorMessage: 'ER_INVALID_WEIGHT:Invalid Weight',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          newOwnerId: 'ER_REQUIRED_NEW_OWNER_ID:New owner Id is required',
          newOwnerType: 'ER_REQUIRED_NEW_OWNER_TYPE:New owner type is required',
          weight: 'ER_REQUIRED_WEIGHT:weight is required',
        },
      },
    },
  },
};
