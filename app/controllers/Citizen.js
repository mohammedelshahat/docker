const {
  create,
  getCitizenById,
  update,
  deleteCitizen,
  getCitizens,
} = require('../services/citizen');

const { controller } = require('../middleware/controller');

module.exports = {
  create: controller(create),
  getCitizenById: controller(getCitizenById),
  update: controller(update),
  deleteCitizen: controller(deleteCitizen),
  getCitizens: controller(getCitizens),
};
