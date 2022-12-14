module.exports = {
  ddocs: {
    item: {
      assets: {
        name: 'assets',
        language: 'javascript',
        views: {
          items: {
            map: `
              function (doc) {
                if ((!doc.docType || doc.docType == 'item')) {
                  emit(doc._id, doc);
                }
              }
            `,
          },
          transfer: {
            map: `
              function (doc) {
                if (doc.docType == 'transfer') {
                  emit(doc._id, doc);
                }
              }
            `,
          },
        },
      },
      count: {
        name: 'count',
        language: 'javascript',
        views: {
          totalItems: {
            map: `
            function (doc) {
              if ((!doc.docType || doc.docType == 'item')) {
                emit(doc._id, 1);
              }
            }
            `,
            reduce: '_count',
          },
          totalParentItems: {
            map: `
            function (doc) {
              if ((!doc.docType || doc.docType == 'item') && doc.ownerId && doc.ownerType) {
                emit(doc._id, 1);
              }
            }
            `,
            reduce: '_count',
          },
          totalTransfers: {
            map: `
            function (doc) {
              if (doc.docType == 'transfer') {
                emit(doc._id, 1);
              }
            }
            `,
            reduce: '_count',
          },
          ownedItems: {
            map: `
            function (doc) {
              if ((!doc.docType || doc.docType == 'item') && doc.ownerId && doc.ownerType) {
                emit([doc.ownerType, doc.ownerId], 1);
              }
            }
            `,
            reduce: '_count',
          },
          dateTotalItems: {
            map: `
              function (doc) {
                if ((!doc.docType || doc.docType == 'item') && doc.ownerId && doc.ownerType && doc.createdAt) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
  
                  emit([year, month, day, hour, minute, second], 1);
                }
              }
            `,
            reduce: '_count',
          },
          dateTotalOwnedItems: {
            map: `
              function (doc) {
                if ((!doc.docType || doc.docType == 'item') && doc.ownerId && doc.ownerType && doc.createdAt) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
  
                  emit([doc.ownerType, doc.ownerId,   year, month, day, hour, minute, second], 1);
                }
              }
            `,
            reduce: '_count',
          },
          dateTotalHallmarkedItems: {
            map: `
              function (doc) {
                if ((!doc.docType || doc.docType == 'item') && doc.createdAt && doc.goldsmithId && doc.goldsmithType) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
  
                  emit([doc.goldsmithType, doc.goldsmithId, year, month, day, hour, minute, second], 1);
                }
              }
            `,
            reduce: '_count',
          },
        },
      },
      detailedReports: {
        name: 'detailedReports',
        language: 'javascript',
        views: {
          hallmarkingCount: {
            map: `
              function (doc) {
                if ((!doc.docType || doc.docType == 'item') && doc.ownerId && doc.ownerType && doc.createdAt) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
  
                  emit([1, year, month, day, doc.goldsmithId + "_" + doc.goldsmithType, doc.metalType, doc.category, doc.naming], 1);
                  // monthly report
                  // emit([2, year, month, doc.goldsmithId + "_" + doc.goldsmithType, doc.metalType, doc.category, doc.naming], 1);
                  // yearly report
                  // emit([3, year, doc.goldsmithId + "_" + doc.goldsmithType, doc.metalType, doc.category, doc.naming], 1);
                }
              }
            `,
            reduce: '_count',
          },
          ownedItems: {
            map: `
              function (doc) {
                if (!doc.docType || doc.docType == 'item') {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
                  
                  const owner = doc.ownerId + "_" + doc.ownerType;

                  emit([owner, year, month, day], {
                    goldsmithId: doc.goldsmithId,
                    goldsmithType: doc.goldsmithType,
                    naming: doc.naming,
                    category: doc.category,
                    metalType: doc.metalType,
                    itemStatus: doc.itemStatus
                  });
                }
              }
          `,
          },
          ownedTransfers: {
            map: `
              function (doc) {
                if (doc.docType == 'transfer' && doc.createdAt) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
              
                  emit([year, month, day, hour, minute, second], {
                    to: doc.to,
                    toType: doc.toType,
                    itemKey: doc.itemKey
                  });
                }
              }
            `,
          },
          transferCount: {
            map: `
              function (doc) {
                if (doc.docType == 'transfer' && doc.from && doc.fromType && doc.to && doc.toType && doc.createdAt) {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const second = date.getSeconds();
                  const minute = date.getMinutes();
                  const hour = date.getHours();
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();

                  emit([1,
                    year, month, day,
                    doc.from + "_" + doc.fromType,
                    doc.to + "_" + doc.toType,
                    doc.goldsmithId + "_" + doc.goldsmithType,
                    doc.metalType, doc.category, doc.naming],
                  1);
                  // monthly report
                  // emit([2,
                  //   year, month,
                  //   doc.from + "_" + doc.fromType,
                  //   doc.to + "_" + doc.toType,
                  //   doc.goldsmithId + "_" + doc.goldsmithType,
                  //   doc.metalType, doc.category, doc.naming],
                  // 1);
                  // yearly report
                  // emit([3,
                  //   year,
                  //   doc.from + "_" + doc.fromType,
                  //   doc.to + "_" + doc.toType,
                  //   doc.goldsmithId + "_" + doc.goldsmithType,
                  //   doc.metalType, doc.category, doc.naming],
                  // 1);
                }
              }
            `,
            reduce: '_count',
          },
          fromTransfer: {
            map: `
              function (doc) {
                if (doc.docType == 'transfer') {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
                
                  const from = doc.from + '_' + doc.fromType;

                  emit([from, year, month, day], {
                    itemKey: doc.itemKey,
                    goldsmithId: doc.goldsmithId,
                    goldsmithType: doc.goldsmithType,
                    naming: doc.naming,
                    category: doc.category,
                    metalType: doc.metalType,
                    itemStatus: doc.itemStatus,
                    createdAt: doc.createdAt
                  });
                }
              }
            `,
          },
          toTransfer: {
            map: `
              function (doc) {
                if (doc.docType == 'transfer') {
                  const date = new Date(parseInt(doc.createdAt + '000'));
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // getMonth() starts with 0 not 1
                  const year = date.getFullYear();
                
                  const to = doc.to + '_' + doc.toType;
                  const goldsmith = doc.goldsmithId + "_" + doc.goldsmithType;
              
                  emit([to, year, month, day], {
                    itemKey: doc.itemKey,
                    goldsmithId: doc.goldsmithId,
                    goldsmithType: doc.goldsmithType,
                    naming: doc.naming,
                    category: doc.category,
                    metalType: doc.metalType,
                    itemStatus: doc.itemStatus,
                    createdAt: doc.createdAt
                  });
                }
              }
            `,
          },
        },
      },
    },
    citizen: {
      report: {
        name: 'report',
        language: 'javascript',
        views: {
          name: {
            map: `
              function (doc) {
                if (!doc._id.includes("NID_") && !doc._id.includes("PASSPORT_")) {
                  emit(doc._id, doc.name);
                }
              }
            `,
          },
        },
      },
    },
    company: {
      report: {
        name: 'report',
        language: 'javascript',
        views: {
          name: {
            map: `
              function (doc) {
                if (!doc._id.includes("EMAIL_")) {
                  emit(doc._id, doc.name);
                }
              }
            `,
          },
        },
      },
    },
    shop: {
      report: {
        name: 'report',
        language: 'javascript',
        views: {
          name: {
            map: `
              function (doc) {
                if (!doc._id.includes("EMAIL_")) {
                  emit(doc._id, doc.name);
                }
              }
            `,
          },
        },
      },
    },
  },
};
