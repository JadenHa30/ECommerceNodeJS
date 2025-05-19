'use strict';

const { product, electronic, clothing, furniture } = require('../../models/product.model');
const { ObjectId } = require('mongoose').Types;

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id') //Populate the product_shop field with name and email from the shop model, excluding the _id field
    .sort({updateAt: -1})
    .limit(limit)
    .skip(skip)
    .lean()
    .exec(); //Executes the query and returns a Promise
}

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });

}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({ 
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
     });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({ 
        product_shop: new ObjectId(product_shop),
        _id: new ObjectId(product_id)
     });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    unpublishProductByShop,
};