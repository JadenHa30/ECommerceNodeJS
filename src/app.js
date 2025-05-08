const express = require('express');
const app = express();
const helmet = require("helmet"); // security middleware, cover server vulnerabilities
const morgan = require("morgan"); // logging middleware
const compression = require("compression"); // data response compression middleware

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// db
require("./dbs/init.mongodb");
const { countConnect, checkOverload } = require("./helpers/check.connect");
countConnect();
checkOverload();

// routes
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});

// error handling

module.exports = app;