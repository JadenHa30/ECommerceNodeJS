'use strict';

const { Schema, model, Types} = require('mongoose'); // Erase if already required
const slugify = require('slugify');
        
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    product_shop: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true,
    },
    product_slug: String,
    product_ratingAverage: {
        type: Number,
        default: 1,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be under 5.0'],
        set: val => Math.round(val * 10) / 10,
    },
    product_variations: {
        type: Array,
        default: [],
    },
    isDraft: { //draft product --> not published
        type: Boolean,
        default: true,
        index: true,
        select: false, //document will not be selected by default (ex: when using find() or findOne())
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Document Middleware: it will be executed before saving the document
productSchema.pre('save', function(next) {
    //this keyword is pointing to the current product
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    product_shop: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
}, {
    collection: 'Clothing',
    timestamps: true,
});

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: String,
    color: String,
    product_shop: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
}, {
    collection: 'Electronic',
    timestamps: true,
});

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    color: String,
    product_shop: {
        type: Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
}, {
    collection: 'Furniture',
    timestamps: true,
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
};
