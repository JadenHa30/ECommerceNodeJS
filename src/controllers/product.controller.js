'use strict';

const ProductService = require("../services/product.service");
const { OK } = require("../core/success.response");
class ProductController {
   createProduct = async (req, res) => {
        console.log('req.user', req.user)
        new OK({
            message: "Create product successfully",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        }).send(res);
   };

   //QUERY
   /*
   * @desc: Get all draft product for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return: { JSON } list of draft product
   */
    getAllDraftForShop = async (req, res, next) => {
        new OK({
            message: "Get all draft product for shop",
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }
    //END QUERY
}

module.exports = new ProductController();