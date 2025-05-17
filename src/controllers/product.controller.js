'use strict';

const ProductService = require("../services/product.service");
const { OK } = require("../core/success.response");
class ProductController {
   createProduct = async (req, res) => {
        new OK({
            message: "Create product successfully",
            metadata: await ProductService.createProduct(req.body.product_type, req.body),
        }).send(res);
   };
}

module.exports = new ProductController();