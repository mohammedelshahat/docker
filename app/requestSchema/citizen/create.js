exports.createSchema = {
  type: 'object',
  required: [
    'body',
  ],
  properties: {
    body: {
      type: 'object',
      required: [
        'name',
        'customerType',
        'address',
      ],
      properties: {
        citizenNationalId: {
          type: 'string',
          pattern: '^[2|3][0-9]{13}$',
          errorMessage: 'ER_INVALID_CITIZEN_NATIONAL_ID:Invalid citizen national id',
        },
        passportNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 25,
          errorMessage: 'ER_INVALID_PASSPORT_NUMBER:Invalid passport number',
        },
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
      anyOf: [{
        required: ['citizenNationalId'],
      }, {
        required: ['passportNumber'],
      }],
      errorMessage: {
        required: {
          name: 'ER_REQUIRED_NAME:name is required',
          customerType: 'ER_REQUIRED_CUSTOMER_TYPE:Customer Type is required',
          address: 'ER_REQUIRED_ADDRESS:address is required',
        },
        anyOf: 'ER_REQUIRED_NID_PASSPORT_NUMBER:any of NID or passport number are required',
      },
    },
    query: {},
    params: {},
  },
};
