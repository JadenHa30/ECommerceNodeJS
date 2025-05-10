'use strict';

//save ID user, publicKey, refreshToken
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'SHOP',
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refershToken:{
        type: Array,
        default: [],
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);