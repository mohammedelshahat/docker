const {
  create,
  getCompanyById,
  update,
  deleteCompany,
  getCompanies,
} = require('../services/company');

const { controller } = require('../middleware/controller');

module.exports = {
  create: controller(create),
  getCompanyById: controller(getCompanyById),
  update: controller(update),
  deleteCompany: controller(deleteCompany),
  getCompanies: controller(getCompanies),
};
