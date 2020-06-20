const dotenv = require('dotenv');
const express = require('express');
dotenv.config({ path: './config/config.env' });
const app = express();
const PORT = process.env.PORT;
const bootCampRoutes = require('./routes/bootcamps');

app.use('/api/v1/bootcamps', bootCampRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
  );
});
