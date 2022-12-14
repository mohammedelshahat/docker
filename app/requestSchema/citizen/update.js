exports.updateSchema = {
  type: 'object',
  required: [
    'body',
    'params',
  ],
  properties: {
    body: {
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          errorMessage: 'ER_INVALID_NAME:Invalid name',
        },
        customerType: {
          type: 'string',
          minLength: 1,
          maxLength: 5,
          errorMessage: 'ER_INVALID_CUSTOMER_TYPE:Invalid customer type',
        },
        passportNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 25,
          errorMessage: 'ER_INVALID_PASSPORT_NUMBER:Invalid passport number',
        },
        contactNumbers: {
          type: 'array',
          minItems: 1,
          items: [{
            type: 'string',
            pattern: '^[0][1][0.1.2.5][0-9]{8}$',
          }],
          errorMessage: 'ER_INVALID_CONTACT_NUMBERS:Invalid contact numbers',
        },
        email: {
          type: 'string',
          format: 'email',
          errorMessage: 'ER_INVALID_EMAIL:Invalid email',
        },
        address: {
          type: 'string',
          minLength: 1,
          maxLength: 40,
          errorMessage: 'ER_INVALID_ADDRESS:Invalid address',
        },
      },
      additionalProperties: false,
      minProperties: 1,
    },
    params: {
      required: ['citizenId'],
      properties: {
        citizenId: {
          type: 'string',
          errorMessage: 'ER_INVALID_CITIZEN_ID:Invalid citizen id',
        },
      },
      errorMessage: {
        required: {
          citizenId: 'ER_REQUIRED_CITIZEN_ID:citizen id is required',
        },
      },
    },
    query: {},
  },
};
