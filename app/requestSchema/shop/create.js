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
        'customerCode',
        'customerType',
        'taxCardNumber',
        'taxFileNumber',
        'commercialNumber',
        'contactNumbers',
        'address',
        'licenseNumber',
        'notificationType',
        'isActive',
      ],
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 40,
          errorMessage: 'ER_INVALID_NAME:Invalid name',
        },
        customerCode: {
          type: 'string',
          minLength: 1,
          maxLength: 15,
          errorMessage: 'ER_INVALID_CUSTOMER_CODE:Invalid customer code',
        },
        customerType: {
          type: 'string',
          errorMessage: 'ER_INVALID_CUSTOMER_TYPE:Invalid customer type',
        },
        taxCardNumber: {
          type: 'string',
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
          errorMessage: 'ER_INVALID_COMMERCIAL_NUMBER:Invalid commercial number',
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
      errorMessage: {
        required: {
          name: 'ER_REQUIRED_NAME:name is required',
          customerCode: 'ER_REQUIRED_CUSTOMER_CODE:customer Code is required',
          customerType: 'ER_REQUIRED_CUSTOMER_TYPE:customer Type is required',
          taxCardNumber: 'ER_REQUIRED_TAX_CARD_NUMBER:tax Car dNumber is required',
          taxFileNumber: 'ER_REQUIRED_TAX_FILE_NUMBER:tax File Number is required',
          commercialNumber: 'ER_REQUIRED_COMMERCIAL_NUMBER:commercial Number is required',
          contactNumbers: 'ER_REQUIRED_CONTACT_NUMBERS:contact Numbers is required',
          email: 'ER_REQUIRED_EMAIL:email is required',
          address: 'ER_REQUIRED_ADDRESS:address is required',
          licenseNumber: 'ER_REQUIRED_LICENSE_NUMBER:license Number is required',
          notificationType: 'ER_REQUIRED_NOTIFICATION_TYPE:notification Type is required',
          isActive: 'ER_REQUIRED_IS_ACTIVE:is Active is required',
        },
      },
    },
    query: {},
    params: {},
  },
};
