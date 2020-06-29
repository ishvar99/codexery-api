const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort'];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  let query = Bootcamp.find(JSON.parse(queryString));
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  const bootcamps = await query;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});
// @desc    Get bootcamps within the specified radius
// @route   /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;
  const radius = distance / 6378;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // const body = [];
  // req.on('data', (chunk) => {
  //   body.push(chunk);
  // });
  // req.on('end', () => {
  //   const parsedBody = Buffer.concat(body).toString();
  //   console.log(parsedBody);
  // });
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBootcamp) {
    return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: updatedBootcamp });
});

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const deletedBootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!deletedBootcamp) {
    return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
  }
  res.json({ success: true, data: {} });
});
