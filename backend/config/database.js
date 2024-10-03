const mongoose = require("mongoose");

// Connect to MongoDB
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `Connected to MongoDB successfully to the host : ${con.connection.host}`
      );
    });
};

module.exports = connectDatabase;
