exports.deleteLookupSchema = {
  type: 'object',
  required: ['params'],
  properties: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          errorMessage: 'ER_INVALID_ID:Invalid id',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          id: 'ER_REQUIRED_ID:id is required',
        },
      },
    },
    query: {},
    body: {},
  },
  errorMessage: {
    required: {
      params: 'ER_REQUIRED_PARAMS:params is required',
    },
  },
};
