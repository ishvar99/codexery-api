const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse');
// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamp = async (req, res, next) => {
  const id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
      return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.createBootcamp = async (req, res, next) => {
  // const body = [];
  // req.on('data', (chunk) => {
  //   body.push(chunk);
  // });
  // req.on('end', () => {
  //   const parsedBody = Buffer.concat(body).toString();
  //   console.log(parsedBody);
  // });
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.updateBootcamp = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBootcamp) {
      return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
    }
    res.status(200).json({ success: true, data: updatedBootcamp });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.deleteBootcamp = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!deletedBootcamp) {
      return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
