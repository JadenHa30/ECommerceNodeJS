'use strict';

const { product, electronic, clothing, furniture } = require('../../models/product.model');

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id') //Populate the product_shop field with name and email from the shop model, excluding the _id field
    .sort({updateAt: -1})
    .limit(limit)
    .skip(skip)
    .lean()
    .exec(); //Executes the query and returns a Promise
}

module.exports = {
    findAllDraftForShop,
};