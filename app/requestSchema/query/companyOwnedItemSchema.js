exports.companyItemsSchema = {
  type: 'object',
  required: ['params'],
  properties: {
    params: {
      type: 'object',
      required: ['companyId'],
      properties: {
        companyId: {
          type: 'string',
          errorMessage: 'ER_INVALID_COMPANY_ID:Invalid company id',
        },
      },
      additionalProperties: false,
      errorMessage: {
        required: {
          errorMessage: 'ER_INVALID_COMPANY_ID:Invalid company id',
        },
      },
    },
    query: {},
    body: {},
  },
  errorMessage: {
    required: {
      params: 'ER_REQUIRED_QUERY:query is required',
    },
  },
};
