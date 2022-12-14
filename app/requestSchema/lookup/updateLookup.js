exports.updateLookupSchema = {
  type: 'object',
  required: ['body', 'params'],
  properties: {
    body: {
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_NAME:Invalid name',
        },
        code: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_CODE:Invalid code',
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_DESCRIPTION:Invalid description',
        },
      },
      additionalProperties: false,
      minProperties: 1,
    },
    params: {
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          errorMessage: 'ER_INVALID_ID:Invalid id',
        },
      },
      errorMessage: {
        required: {
          id: 'ER_REQUIRED_ID:id is required',
        },
      },
    },
    query: {},
  },
};
