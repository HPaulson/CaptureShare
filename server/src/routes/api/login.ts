import {
    builtinModules
} from "module"
const express = require('express')
const router = express.Router()
const config = require('../../config.json')
router.post('/', async (req: any, res: {
    status: (arg0: number) => {
        (): any;
        new(): any;
        send: {
            (arg0: {
                status: number;data: any;message: string
            }): any;new(): any
        }
    }
}) => {
    let foundUser;

    config.users.forEach((user) => {
        if (user.username === req.body.username && user.password === req.body.password) {

            foundUser = user
        }
    })

    if (!foundUser) {

        return res.status(403).send({
            status: 403,
            message: 'UNAUTHORIZED',
            data: []
        })

    } else {

        return res.status(200).send({
            status: 200,
            message: 'OK',

            data: foundUser.username
        })
    }
})

module.exports = router