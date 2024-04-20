const mongoose = require("mongoose");
const ConnectDb = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("connected successfully");
  } catch (error) {
    console.log("unable to connect database");
  }
};

module.exports = ConnectDb;
