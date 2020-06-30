const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Post Register User
// @route   GET /api/v1/auth/register
// @access  public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});

// @desc    Post Login User
// @route   GET /api/v1/auth/login
// @access  public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }
  const match = await user.comparePasswords(password);
  if (!match) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }
  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});
