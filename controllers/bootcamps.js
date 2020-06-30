const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
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
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
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

// @desc    Create a bootcamp
// @route   POST /api/v1/bootcamps
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

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps
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

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const deletedBootcamp = await Bootcamp.findById(id);
  if (!deletedBootcamp) {
    return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
  }
  deletedBootcamp.remove();
  res.json({ success: true, data: {} });
});

// @desc    Upload bootcamp photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Cannot find resource with id ${id}`, 404));
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if (!file.size > process.env.FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(`Size of image should be less than 1MB`, 400)
    );
  }
  file.name = `photo_${bootcamp._id}.${file.mimetype.split('/')[1]}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse('Internal Server Error', 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
