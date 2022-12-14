exports.dateTotalCTZNSchema = {
  type: 'object',
  required: ['query', 'params'],
  properties: {
    params: {
      type: 'object',
      required: ['citizenId'],
      properties: {
        citizenId: {
          type: 'string',
          errorMessage: 'ER_INVALID_CITIZEN_ID:Invalid citizen id',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          citizenId: 'ER_REQUIRED_CITIZEN_ID:citizen id is required',
        },
      },
    },
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
  },
  errorMessage: {
    required: {
      query: 'ER_REQUIRED_QUERY:query is required',
      params: 'ER_REQUIRED_PARAMS:params is required',
    },
  },
};
