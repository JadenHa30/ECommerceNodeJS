'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));
// router.get('/', (req, res) => {
//     res.send('Welcome to the E-commerce API');
// });

module.exports = router