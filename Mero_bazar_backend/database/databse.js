// const mongoose = require('mongoose')

// const connectDB = () => {
//     mongoose.connect(process.env.MONGODB_URL).then(() =>{
//         console.log("Database connected succesfully!!");
//     });
// }

// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
