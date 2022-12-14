exports.generateDateKeys = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (Number.isNaN(from.getTime())) return { err: 'ER_INVALID_FROM:Invalid from', status: 400 };
  if (Number.isNaN(to.getTime())) return { err: 'ER_INVALID_TO:Invalid to', status: 400 };

  if (from.getTime() > to.getTime()) return { err: 'from should be bigger than to value', status: 400 };

  const startkey = [from.getFullYear(), from.getMonth() + 1, from.getDate()];
  const endkey = [to.getFullYear(), to.getMonth() + 1, to.getDate()];

  return { startkey, endkey };
};
