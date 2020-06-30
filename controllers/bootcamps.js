const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const geocoder = require('../utils/geocoder');
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit', 'skip'];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  let query = Bootcamp.find(JSON.parse(queryString)).populate('courses');
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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query.skip(startIndex).limit(limit);
  const bootcamps = await query;
  const pagination = {};
  pagination.current = {
    page: page,
    limit,
  };
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    pagination,
  });
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
