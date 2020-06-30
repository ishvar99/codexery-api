const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const fs = require('fs');
require('colors');
const Bootcamp = require('./models/bootcamp');
const Course = require('./models/course');
const mongoose = require('mongoose');

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Bootcamp.deleteMany({});
    await Course.deleteMany({});
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Invalid Request'.red.inverse);
  process.exit();
}
