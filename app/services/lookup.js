const db = require('../../models');
const { customAssign } = require('../../utils/core');
const { Pagination } = require('../../utils/pagination');

exports.getEnums = async ({ query }) => {
  const { pageNumber } = query;

  const pagination = new Pagination(pageNumber);
  const { count, rows } = await db.Enum.findAndCountAll({
    limit: pagination.pageSize,
    offset: pagination.getOffset(),
    attributes: ['id', 'chaincode', 'name', 'description'],
  });

  return {
    message: 'query successful',
    meta: pagination.getMetaData(count),
    data: rows,
  };
};

exports.addLookups = async ({ body }) => {
  const { enumId, name, code, description } = body;

  const foundEnum = await db.Enum.findOne({ where: { id: enumId }, raw: true });
  if (!foundEnum) return { err: 'enum not found', status: 404 };

  const foundLookup = await db.Lookup.findOne({ where: { enumId, code } });
  if (foundLookup) return { err: 'lookup with the same code already exists', status: 409 };

  const lookup = await db.Lookup.create({ enumId, name, code, description });
  return {
    message: 'lookup added successfully',
    data: { lookup: lookup.toJSON() },
  };
};

exports.getLookups = async ({ query }) => {
  const { id, enumId, code, pageNumber } = query;

  const pagination = new Pagination(pageNumber);
  const { count, rows } = await db.Lookup.findAndCountAll({
    where: customAssign({}, { id, enumId, code }),
    limit: pagination.pageSize,
    offset: pagination.getOffset(),
    attributes: ['id', 'enumId', 'name', 'code', 'description'],
  });

  return {
    message: 'query successful',
    meta: pagination.getMetaData(count),
    data: rows,
  };
};

exports.updateLookups = async ({ params, body }) => {
  const { id } = params;
  const { name, code, description } = body;

  const updates = customAssign({}, { name, code, description });
  const lookup = await db.Lookup.findOne({ where: { id }, raw: true });
  if (!lookup) return { err: 'lookup not found', status: 404 };

  await db.Lookup.update(updates, { where: { id } });

  return {
    message: 'lookup updated successfully',
    data: {
      lookup: { ...lookup, ...updates },
    },
  };
};

exports.deleteLookups = async ({ params }) => {
  const { id } = params;

  const lookup = await db.Lookup.findOne({ where: { id } });
  if (!lookup) return { err: 'lookup not found', status: 404 };

  await db.Lookup.destroy({ where: { id } });

  return {
    message: 'lookup deleted successfully',
    data: { lookup: lookup.toJSON() },
  };
};
