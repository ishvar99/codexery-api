const Course = require('../models/course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const Bootcamp = require('../models/bootcamp');
// @desc    Get Courses
// @route   GET api/v1/courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get Single Course
// @route   GET api/v1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Cannot find resource with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Create a Course
// @route   POST api/v1/bootcamps/:bootcampId/courses
// @access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Cannot find Bootcamp with id ${req.params.bootcampId}`,
        404
      )
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   PUT api/v1/courses/:id
// @access  Public

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`Cannot find Course with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Cannot find Course with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
