const app = require("./app");
const connectDatabase = require("./config/database");

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught exception error message:${err.message}`);
  console.log(`uncaught exception error: ${err.stack}`);
  server.close(() => {
    console.log("Server is closing due to uncaught exception");
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection error message:${err.message}`);
  console.log(`Unhandled rejection error: ${err.stack}`);
  server.close(() => {
    console.log("Server is closing due to unhandled rejection");
    process.exit(1);
  });
});
