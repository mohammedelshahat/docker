exports.ownedReportSchema = {
  type: 'object',
  required: ['query'],
  properties: {
    query: {
      type: 'object',
      required: ['ownerId', 'ownerType', 'date'],
      properties: {
        date: {
          type: 'string',
          format: 'date',
          errorMessage: 'ER_INVALID_DATE:Invalid date',
        },
        ownerId: {
          type: 'string',
          errorMessage: 'ER_INVALID_OWNER_ID:Invalid owner id',
        },
        ownerType: {
          type: 'string',
          enum: ['CTZN', 'SHOP', 'CMPNY'],
          errorMessage: 'ER_INVALID_OWNER_TYPE:Invalid owner type',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          date: 'ER_REQUIRED_DATE:date is required',
          ownerId: 'ER_REQUIRED_OWNER_ID:ownerId is required',
          ownerType: 'ER_REQUIRED_OWNER_TYPE:ownerType is required',
        },
      },
    },
    body: {},
    params: {},
  },
  errorMessage: {
    required: {
      query: 'ER_REQUIRED_QUERY:query is required',
    },
  },
};
