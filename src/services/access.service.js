'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../../utils');
const { BadRequestError, UnauthorizedError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const keytokenModel = require('../models/keytoken.model');

const RoleShop = {
    ADMIN: '0001',
    SHOP: '0002',
    WRITER: '0003',
    EDITOR: '0004',
}

class AccessService {

    static handleRefreshToken = async ({ refreshToken }) => { // when access token expired, this function will be called to distribute new AT and RT
        // check if this token was used
        const foundToken = await KeyTokenService.findKeyByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            //decode to get userId and email
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            await KeyTokenService.deleteKeyById(userId); // delete all token in KeyStore
            throw new ForbiddenError('Something went wrong !! Please login again');
        }

        // check if this token is valid
        const holderToken = await KeyTokenService.findKeyByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new UnauthorizedError('User not registered');
        }

        //verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        //check if userId in db
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new UnauthorizedError('Shop not registered');
        }

        //generate new tokens
        const newTokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
        //update refreshTokenUsed
        await keytokenModel.updateOne(
            { _id: holderToken._id },
            {
                $set: {
                    refreshToken: newTokens.refreshToken,
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken,
                },
            }
        );

        return {
            user: { userId, email },
            tokens: newTokens,
        };
    }

    static logout = async ({ keyStore, password, refreshToken = null }) => {
        const delKey  = await KeyTokenService.removeKeyById(keyStore._id);
        console.log('delKey: ', delKey);
        return delKey;
    }

    /*
        1 - check if email already exists
        2 - match password
        3 - create AccessToken and RefreshToken
        4 - create key token
        5 - get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => { //refreshToken is optional if user wants to relogin
        //1
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered');
        }

        //2
        const isMatch = bcrypt.compareSync(password, foundShop.password);
        if (!isMatch) {
            throw new UnauthorizedError('Password is incorrect');
        }

        //3
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        //4
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId,
        });
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens,
        }
    }
  
    static signup = async ({ name, email, password }) => {
        //step 1: check if email already exists
        const shopHolder = await shopModel.findOne({ email }).lean(); //lean() returns a plain native JS object
        if (!!shopHolder) {
            throw new BadRequestError('Email already exists');
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
                throw new BadRequestError('Failed to create public key');
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
    }
}

module.exports = AccessService;