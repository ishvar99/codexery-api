// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamps = (req, res) => {
  res.send('fetch all bootcamps');
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamp = (req, res) => {
  res.send('fetch single bootcamp');
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.createBootcamp = (req, res) => {
  res.send('create bootcamp');
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.updateBootcamp = (req, res) => {
  res.send('update bootcamp');
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.deleteBootcamp = (req, res) => {
  res.send('delete bootcamp');
};
