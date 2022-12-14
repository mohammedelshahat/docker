exports.addLookupSchema = {
  type: 'object',
  required: ['body'],
  properties: {
    body: {
      type: 'object',
      required: ['enumId', 'name', 'code', 'description'],
      properties: {
        enumId: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          errorMessage: 'ER_INVALID_ENUM_ID:Invalid enumId',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 225,
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
      errorMessage: {
        required: {
          enumId: 'ER_REQUIRED_ENUM_ID:enumId required',
          name: 'ER_REQUIRED_NAME:name is required',
          code: 'ER_REQUIRED_CODE:code is required',
          description: 'ER_REQUIRED_DESCRIPTION:description is required',
        },
      },
    },
    query: {},
    params: {},
  },
};
