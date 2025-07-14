// middleware/advancedResults.js
export default (model, populate = null) => async (req, res, next) => {
  const reqQuery = { ...req.query };
  ['select','sort','page','limit'].forEach(f => delete reqQuery[f]);
  let qs = JSON.stringify(reqQuery)
    .replace(/\b(gt|gte|lt|lte|in|regex)\b/g, m => `$${m}`);
  let query = model.find(JSON.parse(qs)).where({ isActive: true });
  if (req.query.select) query = query.select(req.query.select.split(',').join(' '));
  query = req.query.sort ? query.sort(req.query.sort.split(',').join(' ')) : query.sort('-createdAt');
  const page = +req.query.page || 1, limit = +req.query.limit || 20;
  const skip = (page - 1) * limit;
  const total = await model.countDocuments({ isActive: true });
  query = query.skip(skip).limit(limit);
  if (populate) query = query.populate(populate);
  const results = await query;
  res.advancedResults = { success: true, count: results.length, total, page, data: results };
  next();
};
