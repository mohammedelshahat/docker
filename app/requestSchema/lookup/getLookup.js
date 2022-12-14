exports.getLookupSchema = {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          errorMessage: 'ER_INVALID_ID:Invalid id',
        },
        enumId: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          errorMessage: 'ER_INVALID_ENUM_ID:Invalid enumId',
        },
        code: {
          type: 'string',
          errorMessage: 'ER_INVALID_CODE:Invalid code',
        },
        pageNumber: {
          type: 'string',
          pattern: '^[1-9][0-9]*$',
          default: '1',
          errorMessage: 'ER_INVALID_PAGE_NUMBER:Invalid pageNumber',
        },
      },
      additionalProperties: false,
    },
    body: {},
    params: {},
  },
};
