'use strict';

const keyTokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //lv0
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });

            // return token ? token.publicKey : null;

            //lvxxx
            const filter = {
                user: userId,
            };
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken,
            };
            const options = {
                upsert: true, // If true, creates a new document if no matching document is found
                new: true, // If true, returns the updated document instead of the original one
                setDefaultsOnInsert: true, // Ensures that any default values specified in the schema are set on the newly created document.
            };
            const token = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return token ? token.publicKey : null;
        } catch (error) {
            throw error;
        }
    };

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    }

    static findKeyByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
    }

    static findKeyByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken }).lean();
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({ user: userId});
    }
};

module.exports = KeyTokenService;