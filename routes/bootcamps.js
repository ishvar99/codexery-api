const express = require('express');
const router = express.Router();
const courses = require('./courses');
const Bootcamp = require('../models/bootcamp');
const advancedResults = require('../middlewares/advancedResults');
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
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);
module.exports = router;
