const Bootcamp = require('../models/bootcamp');

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamps = async (req, res) => {
  const bootcamps = await Bootcamp.find({});
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  public
exports.getBootcamp = async (req, res) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.createBootcamp = async (req, res) => {
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
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.updateBootcamp = async (req, res) => {
  const id = req.params.id;
  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBootcamp) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({ success: true, data: updatedBootcamp });
};

// @desc    Get all bootcamps
// @route   /api/v1/bootcamps
// @access  private
exports.deleteBootcamp = async (req, res) => {
  const id = req.params.id;
  const deletedBootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!deletedBootcamp) {
    return res.status(400).json({ success: false });
  }
  res.json({ success: true, data: {} });
};
