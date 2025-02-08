const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");

const models = ["User"];

const createOne = (model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await model.create(req.body);
    const saved = await newDocument.save();
    if (models.includes(model.modelName)) saved.password = undefined;
    res.status(201).json({
      success: true,
      data: saved.toJSON()
    });
  });

const getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    // Query
    let query = model.findById(req.params.id);
    // In user model remove password value
    if (models.includes(model.modelName)) query = query.select("-password -token");
    // Api Features
    const apiFeatures = new ApiFeatures(query, req.query).limitFields().mongooseQueryExec();
    // Execute the query
    let doc = await apiFeatures.mongooseQuery;
    if (!doc[0] || doc.length === 0)
      return next(new ApiError(`${model.modelName} is not found`, 404));
    // Check if the item exists
    doc = doc[0].toJSON();
    // Response
    res.status(200).json({
      success: true,
      data: doc
    });
  });

const getAll = (model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    // Filter Object
    if (req.filterObj) filter = req.filterObj;
    // ApiFeatures instance
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .search(model.modelName)
      .limitFields();

    // Clone apiFeatures to get documents count after filterations
    const clonedApiFeatures = apiFeatures.clone().mongooseQueryExec();
    let docsCount = await clonedApiFeatures.mongooseQuery.countDocuments();

    // Paginate filtered documents
    apiFeatures.pagination(docsCount).mongooseQueryExec();
    // Fetch data
    const { mongooseQuery, paginationResult } = apiFeatures;

    let docs = await mongooseQuery.lean();
    // Response
    res.status(200).json({
      success: true,
      pageResults: docs.length,
      paginationResult,
      data: docs
    });
  });

const updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const updated = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (models.includes(model.modelName)) {
      // updated.password = undefined
      updated.token = undefined;
      updated.passwordResetToken = undefined;
      updated.verificationToken = undefined;
      updated.verifyTokenExpiresAt = undefined;
      updated.passwordResetExpiresAt = undefined;
    }
    if (!updated) return next(new ApiError(`${model.modelName} is not found`, 404));

    await updated.save();
    res.status(200).json({
      success: true,
      data: updated
    });
  });

const deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById(id);
    if (!document) return next(new ApiError(`${model.modelName} is not found`, 404));
    const removed = await document.deleteOne();
    if (!removed)
      return next(
        new ApiError(`Error occurred while deleting the ${model.modelName.toLowerCase()}`, 400)
      );
    res.status(200).json({
      success: true,
      data: `${model.modelName} Deleted Successfully`
    });
  });

module.exports = {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne
};
