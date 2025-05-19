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

   updatePublishProductByShop = async (req, res) => {
        new OK({
            message: "Update product successfully",
            metadata: await ProductService.updatePublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
   }

    updateUnpublishProductByShop = async (req, res) => {
        new OK({
            message: "Update product successfully",
            metadata: await ProductService.updateUnpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
   }

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
            metadata: await ProductService.getAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    getAllPublishForShop = async (req, res, next) => {
        new OK({
            message: "Get all publish product for shop",
            metadata: await ProductService.getAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    getListSearchProducts = async (req, res, next) => {
        new OK({
            message: "Get list search products",
            metadata: await ProductService.getListSearchProducts({
                keySearch: req.params.keySearch,
            }),
        }).send(res);
    }
    //END QUERY
}

module.exports = new ProductController();