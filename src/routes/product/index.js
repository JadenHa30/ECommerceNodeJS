'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);
router.post('', asyncHandler(productController.createProduct));
router.put('/published/:id', asyncHandler(productController.updatePublishProductByShop));

//QUERY
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));
module.exports = router