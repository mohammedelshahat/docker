const debug = require('debug')('app:offchain:migration');
const { fabric, contracts } = require('../../../config');
const { get, createDesignDoc, createViews, createDB } = require('../../../utils/couchdb');

const fabricConfig = fabric[fabric.env];
const { channel } = fabricConfig;
const { ddocs } = require('./ddocs');

(async () => {
  Object.keys(ddocs).map(async (cc) => {
    Object.keys(ddocs[cc]).map(async (ddoc) => {
      debug(`- Creating Design Document: ${ddoc}`);
      const dbname = `${channel}_${contracts[cc]}`;
      debug('- Creating Database');
      const { err: createDBError } = await createDB({ dbname });
      if (createDBError) {
        if (createDBError.includes('already exists')) debug('- Database Already Exists.');
        else debug(`- ERROR CREATING DATABASE: ${createDBError}`);
      }
      const { err } = await get({
        url: `${dbname}/_design/${ddoc}`,
      });
      if (err) {
        const { err: error } = await createDesignDoc({
          dbname,
          docName: ddoc,
          views: ddocs[cc][ddoc].views,
        });
        if (error) debug(`- ERROR CREATING DDOC: ${ddoc}`, error);
        else debug(`- Design Document: ${ddoc} Created`);
      } else {
        debug(`- Design Document: ${ddoc} Already Exists`);
        debug(`- Adding ${ddoc} Views`);
        const { err: error } = await createViews({
          dbname,
          docName: ddoc,
          views: ddocs[cc][ddoc].views,
        });
        if (error) debug(`- ERROR CREATING VIEWS FOR DDOC: ${ddoc}`, error);
      }
    });
  });
})();
