exports.getByIdSchema = {
  type: 'object',
  required: [
    'params',
    'query',
  ],
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
    query: {},
    body: {},
  },
  errorMessage: {
    required: {
      query: 'ER_REQUIRED_QUERY:query is required',
    },
  },
};
