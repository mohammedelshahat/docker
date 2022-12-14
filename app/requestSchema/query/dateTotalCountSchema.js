exports.dateItemsSchema = {
  type: 'object',
  required: ['query'],
  properties: {
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
    params: {},
  },
  errorMessage: {
    required: {
      query: 'ER_REQUIRED_QUERY:query is required',
    },
  },
};
