const express = require('express');
const router = express.Router();
const courses = require('./courses');
const Bootcamp = require('../models/bootcamp');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/protect');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampWithinRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

router.use('/:bootcampId/courses', courses);
router.route('/radius/:zipcode/:distance').get(getBootcampWithinRadius);
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses user'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
module.exports = router;
