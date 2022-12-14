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
          maxLength: 40,
          errorMessage: 'ER_INVALID_NAME:Invalid name',
        },
        customerType: {
          type: 'string',
          minLength: 1,
          maxLength: 5,
          errorMessage: 'ER_INVALID_CUSTOMER_TYPE:Invalid customer type',
        },
        taxCardNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 11,
          errorMessage: 'ER_INVALID_TAX_CARD_NUMBER:Invalid tax card number',
        },
        taxFileNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_TAX_FILE_NUMBER:Invalid tax file number',
        },
        commercialNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_CUSTOMER_CODE:Invalid customer code',
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
          maxLength: 255,
          errorMessage: 'ER_INVALID_ADDRESS:Invalid address',
        },
        licenseNumber: {
          type: 'string',
          minLength: 1,
          maxLength: 15,
          errorMessage: 'ER_INVALID_LICENSE_NUMBER:Invalid license number',
        },
        notificationType: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          errorMessage: 'ER_INVALID_NOTIFICATION_TYPE:Invalid notification type',
        },
        isActive: {
          type: 'boolean',
          errorMessage: 'ER_INVALID_IS_ACTIVE:Invalid is active',
        },
      },
      additionalProperties: false,
      minProperties: 1,
    },
    params: {
      required: ['customerCode'],
      properties: {
        customerCode: {
          type: 'string',
          minLength: 1,
          maxLength: 15,
          errorMessage: 'ER_REQUIRED_CUSTOMER_CODE:customer code is required',
        },
      },
    },
    query: {},
  },
};
