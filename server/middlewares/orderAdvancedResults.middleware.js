const orderAdvancedResults = (model, populate) => async (req, res, next) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Initialize query
    query = model.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      query = query.or([
        { 'orderNumber': { $regex: req.query.search, $options: 'i' } },
        { 'trackingNumber': { $regex: req.query.search, $options: 'i' } },
        { 'status': { $regex: req.query.search, $options: 'i' } }
      ]);
    }

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
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Enhanced population handling
      // Enhanced Population Handling
    if (populate) {
      if (Array.isArray(populate)) {
        // Handle array of population options
        populate.forEach(populateOption => {
          if (typeof populateOption === 'string') {
            query = query.populate(populateOption);
          } else if (populateOption?.path) {
            query = query.populate({
              path: populateOption.path,
              select: populateOption.select || '',
              model: populateOption.model // Explicit model reference
            });
          }
        });
      } else if (typeof populate === 'object' && populate.path) {
        // Handle single population object
        query = query.populate({
          path: populate.path,
          select: populate.select || '',
          model: populate.model // Explicit model reference
        });
      } else if (typeof populate === 'string') {
        // Handle simple string path
        query = query.populate(populate);
      }
    }

    // Execute query
    const results = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.orderAdvancedResults = {
      success: true,
      count: results.length,
      pagination,
      total,
      data: results
    };

    next();
  } catch (err) {
    console.error('Advanced results error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export default orderAdvancedResults;