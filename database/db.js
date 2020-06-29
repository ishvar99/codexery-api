const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB Connected ${conn.connection.host}`.yellow.underline);
};
module.exports = connectDB;
