'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
route.use(apiKey)
router.use(permission('0000'));

router.use('/v1/api', require('./access'));
// router.get('/', (req, res) => {
//     res.send('Welcome to the E-commerce API');
// });

module.exports = router