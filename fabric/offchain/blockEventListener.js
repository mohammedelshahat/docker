/* eslint-disable no-await-in-loop */
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

/*

blockEventListener.js is an nodejs application to listen for block events from
a specified channel.

Configuration is stored in config.json:

{
   "peer_name": "peer0.org1.example.com",
   "channelid": "mychannel",
   "use_couchdb":false,
   "couchdb_address": "http://localhost:5990"
}

peer_name:  target peer for the listener
channelid:  channel name for block events
use_couchdb:  if set to true, events will be stored in a local couchdb
couchdb_address:  local address for an off chain couchdb database

Note:  If use_couchdb is set to false, only a local log of events will be stored.

Usage:

node bockEventListener.js

The block event listener will log events received to the console and write event blocks to
a log file based on the channelid and chaincode name.

The event listener stores the next block to retrieve in a file named nextblock.txt.  This file
is automatically created and initialized to zero if it does not exist.

*/

const debug = require('debug')('app:fabric:blockListener');
const _ = require('lodash');
const config = require('./config');
const { getNextBlock, setNextBlock } = require('./blockCounter');

const { channelId, useCouchdb, couchdbAddress } = config;
// eslint-disable-next-line import/order
const nano = require('nano')(couchdbAddress);
const blockProcessing = require('./blockProcessing.js');

const { getNetwork } = require('../index');

// simple map to hold blocks for processing
class BlockMap {
  constructor() {
    this.list = [];
  }

  get(key) {
    const intKey = parseInt(key, 10).toString();
    return this.list[`block${intKey}`];
  }

  set(key, value) {
    this.list[`block${key}`] = value;
  }

  remove(key) {
    const intKey = parseInt(key, 10).toString();
    delete this.list[`block${intKey}`];
  }
}

const ProcessingMap = new BlockMap();

// listener function to check for blocks in the ProcessingMap
async function processPendingBlocks(ProcessMap) {
  setTimeout(async () => {
    // get the next block number from nextblock.txt
    let nextBlockNumber = await getNextBlock();
    let processBlock;

    do {
      // get the next block to process from the ProcessingMap
      processBlock = ProcessMap.get(nextBlockNumber);

      if (processBlock === undefined) {
        break;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        await blockProcessing.processBlockEvent(channelId, processBlock, useCouchdb, nano);
      } catch (error) {
        debug(`ERROR: Failed to process block: ${error}`);
      }

      // if successful, remove the block from the ProcessingMap
      ProcessMap.remove(nextBlockNumber);

      // increment the next block number to the next block
      await setNextBlock(parseInt(nextBlockNumber, 10) + 1);

      // retrieve the next block number to process
      nextBlockNumber = await getNextBlock();
    // eslint-disable-next-line no-constant-condition
    } while (true);

    processPendingBlocks(ProcessMap);
  }, 250);
}

async function blockListener(block) {
  const { blockData } = block;
  // Add the block to the processing map by block number
  ProcessingMap.set(blockData.header.number, blockData);

  debug(`Added block ${blockData.header.number} to ProcessingMap`);
}

async function listen() {
  try {
    // initialize the next block to be 1
    let nextBlock = 1;

    nextBlock = await getNextBlock();

    const network = await getNetwork();

    await network.addBlockListener(
      blockListener,
      // set the starting block for the listener
      { filtered: false, startBlock: parseInt(nextBlock, 10) },
    );

    debug(`Listening for block events, nextblock: ${nextBlock}`);

    const listener = network.blockListeners.get(blockListener);
    const started = _.get(listener, ['eventSource', 'started'], false);

    // restart the listener after 1 minute if not running
    if (!started) {
      setTimeout(() => {
        debug('listener not running, restarting...');
        network.removeBlockListener(blockListener);
        listen();
      }, 60 * 1000);
    }

    // start processing, looking for entries in the ProcessingMap
    processPendingBlocks(ProcessingMap);
  } catch (error) {
    debug(`ERROR: Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

listen();
