'use strict';

const keyTokenModel = require('../modals/keytoken.model');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const token = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            });

            return token ? token.publicKey : null;
        } catch (error) {
            throw error;
        }
    };
};

module.exports = KeyTokenService;