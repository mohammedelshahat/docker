exports.createSchema = {
  type: 'object',
  required: [
    'body',
  ],
  properties: {
    body: {
      type: 'object',
      required: [
        'metalType',
        'yearCode',
        'category',
        'awaBranch',
        'hallmarkingDate',
        'goldsmithId',
        'goldsmithType',
        'boxId',
        'isOverlay',
        'itemStatus',
        'weight',
      ],
      properties: {
        itemCode: {
          type: 'string',
          pattern: '^[A-Z0-9]{10}$',
          errorMessage: 'ER_INVALID_ITEM_CODE:Invalid item code',
        },
        yearCode: {
          type: 'string',
          minLength: 1,
          maxLength: 1,
          errorMessage: 'ER_INVALID_YEAR_CODE:Invalid year code',
        },
        milleniumRatio: {
          type: 'number',
          errorMessage: 'ER_INVALID_MILLENIUM_RATIO: Invalid millenium ratio',
        },
        ownerId: {
          type: 'string',
          errorMessage: 'ER_INVALID_OWNER_ID:Invalid Owner Id',
        },
        ownerType: {
          type: 'string',
          enum: ['CTZN', 'CMPNY', 'SHOP'],
          errorMessage: 'ER_INVALID_OWNER_TYPE:Invalid Owner Type',
        },
        itemParentId: {
          type: 'string',
          minLength: 6,
          maxLength: 10,
          errorMessage: 'ER_INVALID_ITEM_PARENT_ID: Invalid item parent id',
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          errorMessage: 'ER_INVALID_DESCRIPTION: Invalid description',
        },
        hallmarkingDate: {
          type: 'number',
          minimum: 1,
          errorMessage: 'ER_INVALID_HALLMARKING_DATE:Invalid hallmarking date',
        },
        goldsmithId: {
          type: 'string',
          errorMessage: 'ER_INVALID_GOLDSMITH_ID:Invalid goldsmith Id',
        },
        goldsmithType: {
          type: 'string',
          enum: ['CTZN', 'CMPNY', 'SHOP'],
          errorMessage: 'ER_INVALID_GOLDSMITH_TYPE:Invalid goldsmith Type',
        },
        boxId: {
          type: 'number',
          errorMessage: 'ER_INVALID_BOX_ID:Invalid box Id',
        },
        isOverlay: {
          type: 'boolean',
          errorMessage: 'ER_INVALID_IS_OVERLAY:Invalid is overlay',
        },
        overlayMetal: {
          type: 'string',
          minLength: 1,
          maxLength: 4,
          errorMessage: 'ER_INVALID_OVERLAY_METAL:Invalid Overlay Metal',
        },
        itemStatus: {
          type: 'string',
          enum: ['STOLEN', 'LOST', 'MOLTEN', 'RESTORED', 'NEW', 'MISSED', 'DELETED'],
          default: 'NEW',
          errorMessage: 'ER_INVALID_ITEM_STATUS:Invalid Item Status',
        },
        weight: {
          type: 'number',
          errorMessage: 'ER_INVALID_WEIGHT:Invalid weight',
        },
        images: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
          },
          errorMessage: 'ER_INVALID_IMAGES:Invalid images',
        },
        folderId: {
          type: 'string',
          errorMessage: 'ER_INVALID_FOLDER_ID:Invalid folderId',
        },
        createdAt: {
          type: 'string',
          errorMessage: 'ER_INVALID_CREATED_AT:Invalid createdAt',
        },
      },
      allOf: [{
        if: {
          properties: {
            isOverlay: { const: true },
          },
          required: ['isOverlay'],
        },
        then: {
          required: ['overlayMetal'],
          errorMessage: 'ER_REQUIRED_OVERLAY_METAL:Overlay metal is required',
        },
        else: true,
      }],
      oneOf: [{
        required: ['ownerId', 'ownerType'],
      }, {
        required: ['itemParentId'],
      }],
      additionalProperties: false,
      errorMessage: {
        required: {
          metalType: 'ER_REQUIRED_METAL_TYPE:Metal type is required',
          yearCode: 'ER_REQUIRED_YEAR_CODE:year code is required',
          category: 'ER_REQUIRED_CATEGORY:Category is required',
          awaBranch: 'ER_REQUIRED_BRANCH:Branch is required',
          hallmarkingDate: 'ER_REQUIRED_HALLMARKING_DATE:Hallmarking date is required',
          goldsmithId: 'ER_REQUIRED_GOLDSMITH_ID:Goldsmith id is required',
          goldsmithType: 'ER_REQUIRED_GOLDSMITH_TYPE:Goldsmith type is required',
          boxId: 'ER_REQUIRED_BOX_ID:Box id is required',
          isOverlay: 'ER_REQUIRED_IS_OVERLAY:is overlay is required',
          itemStatus: 'ER_REQUIRED_ITEM_STATUS:Item status is required',
          weight: 'ER_REQUIRED_WEIGHT:weight is required',
        },
        oneOf: 'ER_CONFLICT_OWNER_PARENT:item parent and owner not allowed together',
      },
    },
    query: {},
    params: {},
  },
};
