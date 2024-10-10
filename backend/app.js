const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorHandler");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("./middlewares/passport");

dotenv.config({ path: path.join(__dirname, "config/config.env") });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:8000",
//   "https://growwell.com",
// ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_LOCAL_URL,
      collection: "sessions",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true for HTTPS
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const products = require("./routes/productRoute");
const auth = require("./routes/authRoute");

app.use("/api/v1/", products);
app.use("/api/v1/", auth);

// app.get("/", (req, res) => {
//   res.send("Welcome to the E-commerce API!");
// });

app.use(errorHandler);

module.exports = app;
