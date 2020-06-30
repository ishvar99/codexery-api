const express = require('express');
const router = express.Router();
const courses = require('./courses');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampWithinRadius,
} = require('../controllers/bootcamps');

router.use('/:bootcampId/courses', courses);
router.route('/radius/:zipcode/:distance').get(getBootcampWithinRadius);
router.route('/').get(getBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
