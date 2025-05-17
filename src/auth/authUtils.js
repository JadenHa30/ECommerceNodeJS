'use strict';
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });

        //verify token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('Error verifying access token:', err);
                throw new Error('Token verification failed');
            } else {
                console.log('Decoded access token:', decode);
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error('createTokenPair error:', error);
        throw error;
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /* 
        1. Check userId missing??
        2. get accessToken
        3. verify token
        4. check user in db
        5. check keyStore with this userId
        6. Ok all -> next
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new UnauthorizedError('Invalid Request');
    }

    //2
    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not Found KeyStore');
    }

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new UnauthorizedError('Invalid Request. UNAUTHORIZATION HEADER');
    }

    //4
    try {
        const decode = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decode.userId) {
            throw new UnauthorizedError('Invalid Request');
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw `authentication: ${error}`;
    }
});

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
}