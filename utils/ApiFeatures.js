class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    // Mongoose query
    this.mongooseQuery = mongooseQuery;
    // req.query
    this.queryString = queryString;
    // find query string (filter)
    this.findQuery = {};
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    // Exclude unnecessary fields from the filter
    const excludesFields = ["page", "perPage", "sort", "fields", "search"];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    // Reformat the query string
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(queryStr);
    // Process each field in the query
    Object.keys(queryObj).forEach((field) => {
      // Normal filter fields
      this.findQuery[field] = queryObj[field];
    });

    return this;
  }

  search(model) {
    // console.log("I'm In search at first");
    if (this.queryString.search) {
      if (model === "User") {
        this.findQuery.$or = [
          {
            firstName: {
              $regex: this.queryString.search.trim(),
              $options: "i"
            }
          },
          {
            lastName: {
              $regex: this.queryString.search.trim(),
              $options: "i"
            }
          },
          {
            email: {
              $regex: this.queryString.search.trim(),
              $options: "i"
            }
          }
        ];
      } else if (["Product"].includes(model)) {
        this.findQuery.name = {
          $regex: `^${this.queryString.search.trim()}`,
          $options: "i"
        };
      } else {
        this.findQuery.name = {
          $regex: this.queryString.search.trim(),
          $options: "i"
        };
      }
    }

    return this || "";
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      // Default sorting if no specific sort is requested
      // Sort by createdAt in descending order (newest first)
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    let fields = new Set();
    if (this.queryString.fields) {
      // Parse fields from query string
      const requestedFields = new Set(this.queryString.fields.split(","));
      requestedFields.forEach((field) => fields.add(field));
    }
    // Convert the Set to a space-separated string
    const fieldsString = Array.from(fields).join(" ");
    console.log("🚀 ~ ApiFeatures ~ limitFields ~ fieldsString:", fieldsString);
    this.mongooseQuery = this.mongooseQuery.select(`${fieldsString} -__v`); // exclude __v

    return this;
  }

  pagination(docCount) {
    // Values
    const page = this.queryString.page * 1 || 1;
    const perPage = this.queryString.perPage * 1 || 50;
    const skip = (page - 1) * perPage;
    // Pagination object
    const pagination = {};
    pagination.totalResults = docCount;
    pagination.totalPages = Math.ceil(docCount / perPage);
    pagination.perPage = perPage;
    pagination.currentPage = page;
    // Add pagination values to mongoose query
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(perPage);
    // Final pagination object values
    this.paginationResult = pagination;
    return this;
  }

  mongooseQueryExec() {
    this.mongooseQuery = this.mongooseQuery.find(this.findQuery);
    return this;
  }

  clone() {
    // Create a new mongoose query instance
    const clonedMongooseQuery = this.mongooseQuery.model.find();
    // Clone the conditions
    clonedMongooseQuery._conditions = { ...this.mongooseQuery._conditions };
    // Clone other properties as needed
    clonedMongooseQuery.options = { ...this.mongooseQuery.options };
    clonedMongooseQuery._fields = { ...this.mongooseQuery._fields };
    clonedMongooseQuery._update = { ...this.mongooseQuery._update };
    // Create a new ApiFeatures instance
    const clonedApiFeatures = new ApiFeatures(clonedMongooseQuery, this.queryString);
    // Clone the find query
    clonedApiFeatures.findQuery = { ...this.findQuery };
    // Return the cloned ApiFeatures instance
    return clonedApiFeatures;
  }
}

module.exports = ApiFeatures;
