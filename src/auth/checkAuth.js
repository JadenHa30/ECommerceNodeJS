'use strict';

const { findById } = require('../services/apikey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error. API key is missing',
            });
        }
        // check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error. API key is invalid',
            });
        }

        req.objKey = objKey;
        return next();
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        const { objKey } = req;
        if (!objKey.permissions.includes(permission)) {
            return res.status(403).json({
                message: 'Permission denied. You do not have permission to access this resource',
            });
        }
        const validPermission = objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission denied. You do not have permission to access this resource',
            });
        }
        return next();
    }
}

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler,
};