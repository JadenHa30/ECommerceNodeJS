require("dotenv").config(); // load env variables
const express = require('express');
const app = express();
const helmet = require("helmet"); // security middleware, cover server vulnerabilities
const morgan = require("morgan"); // logging middleware
const compression = require("compression"); // data response compression middleware

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db
require("./dbs/init.mongodb");
// const { countConnect, checkOverload } = require("./helpers/check.connect");
// countConnect();
// checkOverload();

// routes
app.use('/', require("./routes"));

// error handling after all routes
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
        message,
    });
});

module.exports = app;