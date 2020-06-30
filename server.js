const dotenv = require('dotenv');
const express = require('express');
const colors = require('colors');
dotenv.config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT;
const bootCampRoutes = require('./routes/bootcamps');
const courseRoutes = require('./routes/courses');
const connectDB = require('./database/db');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const course = require('./models/course');
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
connectDB();
app.use(express.json());
app.use('/api/v1/bootcamps', bootCampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
  );
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red);
  //close and exit server
  server.close(() => process.exit(1));
});
