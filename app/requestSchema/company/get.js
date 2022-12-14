exports.getSchema = {
  type: 'object',
  properties: {
    query: {
      type: 'object',
      properties: {
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
