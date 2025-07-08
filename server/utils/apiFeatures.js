import { Types } from 'mongoose';

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.pagination = {};
  }

  // Advanced filtering (gt, gte, lt, lte, in, etc.)
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Convert query strings to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|nin|ne)\b/g, match => `$${match}`);

    // Handle special cases for ObjectIds
    const parsedQuery = JSON.parse(queryStr);
    Object.keys(parsedQuery).forEach(key => {
      if (Types.ObjectId.isValid(parsedQuery[key])) {
        parsedQuery[key] = new Types.ObjectId(parsedQuery[key]);
      } else if (typeof parsedQuery[key] === 'object' && !Array.isArray(parsedQuery[key])) {
        Object.keys(parsedQuery[key]).forEach(operator => {
          if (Types.ObjectId.isValid(parsedQuery[key][operator])) {
            parsedQuery[key][operator] = new Types.ObjectId(parsedQuery[key][operator]);
          }
        });
      }
    });

    this.query = this.query.find(parsedQuery);
    return this;
  }

  // Advanced search across multiple fields
  search() {
    if (this.queryString.search) {
      const searchFields = ['name', 'description', 'title']; // Configurable
      const searchRegex = new RegExp(this.queryString.search, 'i');
      
      const searchQuery = searchFields.map(field => ({
        [field]: searchRegex
      }));

      this.query = this.query.or(searchQuery);
    }
    return this;
  }

  // Dynamic sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Field limiting (projection)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Population of related documents
  populate(popOptions) {
    if (popOptions) {
      this.query = this.query.populate(popOptions);
    }
    return this;
  }

  // Pagination with metadata
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.pagination = {
      currentPage: page,
      limit,
      totalDocs: 0 // Will be updated after query execution
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // Execute query with pagination info
  async execWithPagination() {
    // Clone the query to get total count
    const countQuery = this.query.model.find(this.query._conditions);
    const total = await countQuery.countDocuments();

    // Execute the main query
    const docs = await this.query.exec();

    // Update pagination info
    this.pagination.totalDocs = total;
    this.pagination.totalPages = Math.ceil(total / this.pagination.limit);
    this.pagination.hasNextPage = this.pagination.currentPage < this.pagination.totalPages;
    this.pagination.hasPrevPage = this.pagination.currentPage > 1;

    return {
      results: docs,
      pagination: this.pagination
    };
  }
}

// Helper for cursor-based pagination
export const cursorPaginate = (query, { after, limit = 20, sortField = '_id' }) => {
  if (after) {
    query = query.where(sortField).gt(after);
  }
  return query.limit(limit).sort(sortField);
};

export default APIFeatures;