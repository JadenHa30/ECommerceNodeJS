'use strict';

class AccessController {

    signup = async (req, res, next) => {
        try {
            console.log(`[P]::signup::`, req.body)
            /*
                200 OK
                201 CREATED
            */
            return res.status(201).json({
                code: '20001', //self-defined code for success,
                message: 'Create new shop successfully',
                metadata: { userid: 1 }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccessController();