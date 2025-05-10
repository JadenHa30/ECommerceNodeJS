'use strict';

const keyTokenModel = require('../modals/keytoken.model');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const token = await keyTokenModel.create({
                user: userId,
                publicKey,
                privateKey,
            });

            return token ? token.publicKey : null;
        } catch (error) {
            throw error;
        }
    };
};

module.exports = KeyTokenService;