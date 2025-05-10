'use strict';
const shopModel = require('../modals/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../../utils');

const RoleShop = {
    ADMIN: '0001',
    SHOP: '0002',
    WRITER: '0003',
    EDITOR: '0004',
}

class AccessService {
  
    static signup = async ({ name, email, password }) => {
        try {
            //step 1: check if email already exists
            const shopHolder = await shopModel.findOne({ email }).lean(); //lean() returns a plain native JS object
            if (shopHolder) {
                return {
                    code: 'xxxx',
                    message: 'Email already exists',
                    status: 'error',
                }
            }
            
            //step 2: create a new shop
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP],
            });

            if (newShop) {
                //symmetric-key algorithms
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem', // Ensure PEM format
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem', // Ensure PEM format
                //     },
                // });
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log('keys: ' , {privateKey, publicKey});
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                });

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'Failed to create public key',
                        status: 'error',
                    }
                }

                //step 3: create a new key token
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email,
                }, publicKey, privateKey);

                return {
                    code: '201',
                    message: 'Signup successful',
                    status: 'success',
                    metadata: {
                        shop: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop,
                        }),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: 'Internal Server Error',
                status: 'error',
            }
        }
    }
}

module.exports = AccessService;