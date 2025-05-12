'use strict';

const AccessService = require("../services/access.service");
const { OK, Created } = require("../core/success.response");
class AccessController {

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