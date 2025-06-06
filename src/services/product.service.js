'use strict';

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const { findAllDraftForShop, publishProductByShop, findAllPublishForShop, unpublishProductByShop, searchProductByUser } = require('../models/repository/product.repo');

//Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing' | 'Electronic',
        payload
    */
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).createProduct();
    }

    //PUT
    static async updatePublishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async updateUnpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id });
    }

    //QUERY
    static async getAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip });
    }

    static async getAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }
}

// base class for product
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    };

    async createProduct(newProduct) {
        return await product.create({...this, _id: newProduct._id});
    }
}

//subclass for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) {
            throw new BadRequestError('Create clothing failed');
        }

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError('Create product failed');
        }
        return newProduct;
    }
}

//subclass for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) {
            throw new BadRequestError('Create clothing failed');
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError('Create product failed');
        }
        return newProduct;
    }
}


class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) {
            throw new BadRequestError('Create clothing failed');
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) {
            throw new BadRequestError('Create product failed');
        }
        return newProduct;
    }
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;