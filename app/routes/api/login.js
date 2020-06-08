var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = express.Router();
const config = require('../../config.json');
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let foundUser;
    config.users.forEach((user) => {
        if (user.username === req.body.username && user.password === req.body.password) {
            foundUser = user;
        }
    });
    if (!foundUser) {
        return res.status(403).send({
            status: 403,
            message: 'UNAUTHORIZED',
            data: []
        });
    }
    else {
        return res.status(200).send({
            status: 200,
            message: 'OK',
            data: foundUser.username
        });
    }
}));
module.exports = router;
