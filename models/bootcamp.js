const mongoose = require('mongoose');

const geoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    index: '2dsphere',
    required: true,
  },
  formattedAddress: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
});

const bootCampSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Name cannot be more than 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid website url starting with HTTP or HTTPS',
    ],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: geoSchema,
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'default.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('bootcamp', bootCampSchema);
