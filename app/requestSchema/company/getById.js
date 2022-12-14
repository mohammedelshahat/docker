exports.getByIdSchema = {
  type: 'object',
  required: [
    'params',
  ],
  properties: {
    params: {
      required: ['customerCode'],
      properties: {
        customerCode: {
          type: 'string',
          minLength: 1,
          maxLength: 15,
          errorMessage: 'ER_INVALID_CUSTOMER_CODE:Invalid customer code',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          customerCode: 'ER_REQUIRED_CUSTOMER_CODE:customer code is required',
        },
      },
    },
    query: {},
    body: {},
  },
};
