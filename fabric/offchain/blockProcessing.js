/* eslint-disable no-await-in-loop, no-async-promise-executor */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

const fs = require('fs');
const appDebug = require('debug')('app:fabric:blockProcessing');
const debug = require('debug')('fabric:blockProcessing');
const couchdbutil = require('./couchdbutil.js');
const { setNextBlock } = require('./blockCounter');

function isJSON(value) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

async function writeValuesToCouchDBP(nano, channelname, writeObject) {
  return new Promise((async (resolve, reject) => {
    try {
      debug('writeObject: ', writeObject);
      // define the database for saving block events by key - this emulates world state
      const dbname = `${channelname}_${writeObject.chaincodeid}`;
      // define the database for saving all block events - this emulates history
      const historydbname = `${channelname}_${writeObject.chaincodeid}_history`;
      // set values to the array of values received
      const { values } = writeObject;

      try {
        for (let i = 0; i < values.length; i += 1) {
          const keyvalue = values[i];

          if (keyvalue.is_delete === true) {
            await couchdbutil.deleteRecord(nano, dbname, keyvalue.key);
          } else if (isJSON(keyvalue.value)) {
            //  insert or update value by key - this emulates world state behavior
            await couchdbutil.writeToCouchDB(
              nano,
              dbname,
              keyvalue.key,
              JSON.parse(keyvalue.value),
            );
          }

          // add additional fields for history
          keyvalue.timestamp = writeObject.timestamp;
          keyvalue.blocknumber = parseInt(writeObject.blocknumber, 10);
          keyvalue.sequence = parseInt(i, 10);

          await couchdbutil.writeToCouchDB(nano, historydbname, null, keyvalue);
        }
      } catch (error) {
        debug('ERROR: ', error);
        reject(error);
      }
    } catch (error) {
      debug(`ERROR: Failed to write to couchdb: ${error}`);
      reject(error);
    }

    resolve(true);
  }));
}

exports.processBlockEvent = async (
  channelname, block, useCouchdb, nano,
) => new Promise((async (resolve, reject) => {
  // reject the block if the block number is not defined
  if (block.header.number === undefined) {
    reject(new Error('Undefined block number'));
  }

  const blockNumber = block.header.number;

  debug('------------------------------------------------');
  debug(`Block Number: ${blockNumber}`);

  // reject if the data is not set
  if (block.data.data === undefined) {
    reject(new Error('Data block is not defined'));
  }

  const dataArray = block.data.data;

  // transaction filter for each transaction in dataArray
  const txSuccess = block.metadata.metadata[2];

  for (let i = 0; i < dataArray.length; i += 1) {
    const dataItem = dataArray[i];

    // reject if a timestamp is not set
    if (dataItem.payload.header.channel_header.timestamp === undefined) {
      reject(new Error('Transaction timestamp is not defined'));
    }

    // tx may be rejected at commit stage by peers
    // only valid transactions (code=0) update the word state and off-chain db
    // filter through valid tx, refer below for list of error codes
    // https://github.com/hyperledger/fabric-sdk-node/blob/release-1.4/fabric-client/lib/protos/peer/transaction.proto
    if (txSuccess[i] !== 0) {
      continue;
    }

    const { timestamp } = dataItem.payload.header.channel_header;

    // continue to next tx if no actions are set
    if (dataItem.payload.data.actions === undefined) {
      continue;
    }

    // actions are stored as an array. In Fabric 1.4.3 only one
    // action exists per tx so we may simply use actions[0]
    // in case Fabric adds support for multiple actions
    // a for loop is used for demonstration
    const { actions } = dataItem.payload.data;

    // iterate through all actions
    for (let j = 0; j < actions.length; j += 1) {
      const actionItem = actions[j];

      // reject if a chaincode id is not defined
      const chaincode = actionItem.payload.chaincode_proposal_payload.input.chaincode_spec;
      const chaincodeID = chaincode.chaincode_id.name;
      if (chaincodeID === undefined) {
        reject(new Error('Chaincode name is not defined'));
      }

      // reject if there is no readwrite set
      const rwSet = actionItem.payload.action.proposal_response_payload.extension.results.ns_rwset;
      if (rwSet === undefined) {
        reject(new Error('No readwrite set is defined'));
      }

      for (let k = 0; k < rwSet.length; k += 1) {
        // ignore lscc events
        if (rwSet[k].namespace !== 'lscc') {
          // create object to store properties
          const writeObject = {};
          writeObject.blocknumber = blockNumber;
          writeObject.chaincodeid = chaincodeID;
          writeObject.timestamp = timestamp;
          writeObject.values = rwSet[k].rwset.writes;

          debug(`Transaction Timestamp: ${writeObject.timestamp}`);
          debug(`ChaincodeID: ${writeObject.chaincodeid}`);
          debug(writeObject.values);

          // send the object to a log file
          fs.appendFileSync(
            `${__dirname}/${channelname}_${chaincodeID}.log`,
            `${JSON.stringify(writeObject)}\n`,
          );

          // if couchdb is configured, then write to couchdb
          if (useCouchdb) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await writeValuesToCouchDBP(nano, channelname, writeObject);
            } catch (error) {
              debug('ERROR: ', error);
            }
          }
        }
      }
      appDebug(`Added block ${blockNumber} to Couchdb`);
    }
  }

  // update the nextblock.txt file to retrieve the next block
  await setNextBlock(parseInt(blockNumber, 10) + 1);

  resolve(true);
}));
