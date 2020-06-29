const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find({});
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
