// Flexible results handler for pagination, filtering, sorting, etc.
const orderAdvancedResults = (model, populate) => async (req, res, next) => {
  let query = model.find({});

  // Filtering (add ?status=pending or ?user=xxx etc.)
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(skip).limit(limit);

  // Populate if provided
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  res.orderAdvancedResults = {
    success: true,
    count: results.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    },
    data: results
  };

  next();
};

export default orderAdvancedResults;
