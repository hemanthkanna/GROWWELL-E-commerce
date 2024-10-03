const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config({ path: path.join(__dirname, "config/config.env") });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8000",
  "https://growwell.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API!");
});

app.use(errorHandler);

module.exports = app;
