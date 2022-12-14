/* eslint-disable no-async-promise-executor, no-underscore-dangle */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

const debug = require('debug')('app:fabric:couchdbutil');

exports.createDatabaseIfNotExists = (nano, dbname) => new Promise((async (resolve, reject) => {
  await nano.db.get(dbname, async (err/* , body */) => {
    if (err) {
      if (err.statusCode === 404) {
        await nano.db.create(dbname, (error/* , body */) => {
          if (!error) {
            resolve(true);
          } else {
            reject(error);
          }
        });
      } else {
        reject(err);
      }
    } else {
      resolve(true);
    }
  });
}));

exports.writeToCouchDB = async (
  nano, dbname, key, value,
) => new Promise((async (resolve, reject) => {
  try {
    await this.createDatabaseIfNotExists(nano, dbname);
  } catch (error) {
    debug('ERROR: ', error);
  }

  const db = nano.use(dbname);

  // If a key is not specified, then this is an insert
  if (key == null) {
    db.insert(value, async (err/* , body, header */) => {
      if (err) {
        reject(err);
      }
    });
  } else {
    // If a key is specified, then attempt to retrieve the record by key
    db.get(key, async (err, body) => {
      // parse the value
      const updateValue = value;
      // if the record was found, then update the revision to allow the update
      if (err == null) {
        updateValue._rev = body._rev;
      }
      // update or insert the value
      db.insert(updateValue, key, async (error/* , body, header */) => {
        if (error) {
          reject(error);
        }
      });
    });
  }

  resolve(true);
}));

exports.deleteRecord = async (nano, dbname, key) => new Promise((async (resolve, reject) => {
  try {
    await this.createDatabaseIfNotExists(nano, dbname);
  } catch (error) {
    debug('ERROR: ', error);
  }

  const db = nano.use(dbname);

  // If a key is specified, then attempt to retrieve the record by key
  db.get(key, async (err, body) => {
    // if the record was found, then update the revision to allow the update
    if (err == null) {
      const revision = body._rev;

      // update or insert the value
      db.destroy(key, revision, async (error/* , body, header */) => {
        if (error) {
          reject(error);
        }
      });
    }
  });

  resolve(true);
}));
