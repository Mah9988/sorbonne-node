const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const apiRoutes = require("./app/routers/api");
const app = express();
const bodyParser = require("body-parser");
const errorLogger = require("./app/helpers/errorLog");
const cors = require('cors');
require('dotenv').config();

// ** connect DB :
mongoose.connect("mongodb://0.0.0.0:27017/sorbonne", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
// ** End connect DB
// Use the cors middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.use(bodyParser.json());

app.use(helmet());
// Regular Morgan logger middleware
// app.use((req, res, next) => {
//   // Create a writable stream to capture the response data
//   const originalWrite = res.write;
//   const originalEnd = res.end;

//   const chunks = [];

//   res.write = function (chunk) {
//     chunks.push(chunk);
//     originalWrite.apply(res, arguments);
//   };

//   res.end = function (chunk) {
//     if (chunk) chunks.push(chunk);

//     const responseBody = Buffer.concat(chunks).toString("utf8");

//     // Log both the request and response using Morgan with 'combined' format
//     morgan("combined")(req, res, () => {});

//     // Log the response body
//     console.log("Response Body:");
//     console.log(responseBody);

//     originalEnd.apply(res, arguments);
//   };

//   next();
// });

// Error logging middleware
// app.use(errorLogger);

// call api routes :
app.use("/api", apiRoutes.usersRoutes);
app.use("/api", apiRoutes.qrRoutes);
app.use("/api", apiRoutes.childRoutes);
app.use("/api", apiRoutes.adminRoutes);
app.use("/api", apiRoutes.notificationRoutes);
app.use("/api", apiRoutes.settingRoutes);
app.use("/api", apiRoutes.dashRoutes);

// port :
const port = 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
