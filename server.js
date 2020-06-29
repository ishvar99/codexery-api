const dotenv = require('dotenv');
const express = require('express');
dotenv.config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT;
const bootCampRoutes = require('./routes/bootcamps');
const connectDB = require('./database/db');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
connectDB();
app.use(express.json());
app.use('/api/v1/bootcamps', bootCampRoutes);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
  );
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  //close and exit server
  server.close(() => process.exit(1));
});
