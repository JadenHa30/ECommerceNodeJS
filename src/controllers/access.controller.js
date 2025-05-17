'use strict';

const AccessService = require("../services/access.service");
const { OK, Created } = require("../core/success.response");
class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new OK({
            metadata: await AccessService.handleRefreshToken({ refreshToken: req.body.refreshToken }),
            message: 'Refresh token success',
        }).send(res);
    }

    logout = async (req, res, next) => {
        new OK({
            metadata: await AccessService.logout({ keyStore: req.keyStore }),
            message: 'Logout success',
        }).send(res);
    }
    
    login = async (req, res, next) => {
        new OK({
            metadata: await AccessService.login(req.body),
            message: 'Login success',
        }).send(res);
    }

    signup = async (req, res, next) => {
            console.log(`[P]::signup::`, req.body)
            /*
                200 OK
                201 CREATED
            */
           new Created({
                message: 'Create user success',
                metadata: await AccessService.signup(req.body),
                options: {
                    limit: 10,
                }
            }).send(res);
    }
}

module.exports = new AccessController();