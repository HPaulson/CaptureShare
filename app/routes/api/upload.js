var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const uploads = require('../../database/main.schema').Uploads;
const fs = require('fs-extra');
const path = require("path");
const webcord = require("webcord");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "../../uploads/"));
    },
    filename: function (req, file, cb) {
        const extLen = file.originalname.split('.').length - 1;
        const extention = file.originalname.split('.')[extLen];
        if (config.server.notAllowed.includes(extention)) {
            return cb({
                "status": 400,
                "message": "BAD REQUEST",
                "reason": "BAD FILETYPE"
            }, false);
        }
        else {
            if (config.server.useOriginalName) {
                if (file.originalname.includes('../')) {
                    const len = file.originalname.split('../').length;
                    file.originalname = file.originalname.split('../')[len - 1];
                }
                if (fs.existsSync(path.resolve(__dirname, "../../uploads/" + file.originalname))) {
                    return cb({
                        "status": 409,
                        "message": "CONFLICT",
                        "reason": "FILE EXISTS"
                    }, false);
                }
                else {
                    return cb(null, file.originalname);
                }
            }
            else {
                function str(length) {
                    let result = '';
                    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    for (let i = 0; i < length; i++) {
                        result += letters.charAt(Math.floor(Math.random() * letters.length));
                    }
                    if (fs.existsSync(path.resolve(__dirname, "../../uploads/" + result))) {
                        return str(config.server.nameLength);
                    }
                    else {
                        const len = file.originalname.split('.').length - 1;
                        result = result + '.' + file.originalname.split('.')[len];
                        return result;
                    }
                }
                return cb(null, str(config.server.nameLength));
            }
        }
    }
});
const upload = multer({
    storage: storage
});
mongoose.connect(config.server.mongoURL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedUser;
    config.users.forEach((users) => {
        if (users.password === req.headers.authorization) {
            loggedUser = users;
        }
    });
    if (!loggedUser) {
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
            data: yield uploads.find({
                user: loggedUser.username
            })
        });
    }
}));
router.post('/', upload.array('file', 12), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedUser;
    config.users.forEach((users) => {
        if (users.password === req.headers.authorization) {
            loggedUser = users;
        }
    });
    if (!loggedUser) {
        return res.status(403).send({
            status: 403,
            message: 'UNAUTHORIZED',
            data: []
        });
    }
    else {
        let fullData = [];
        yield req.files.forEach((f) => __awaiter(void 0, void 0, void 0, function* () {
            yield uploads.create({
                _id: f.filename,
                uploadedAt: new Date(),
                user: loggedUser.username,
                fileType: f.mimetype,
                fileSize: f.size
            }).then((x) => __awaiter(void 0, void 0, void 0, function* () {
                yield fullData.push({
                    status: 201,
                    message: 'CREATED',
                    data: x
                });
                const replacers = {
                    user: loggedUser.username,
                    file: x._id,
                    size: x.fileSize / 1000 + 'KB',
                    type: x.fileType,
                    timestamp: x.uploadedAt,
                    link: `${config.server.host}/${x._id}`
                };
                new webcord({
                    url: config.webhook.url,
                    name: config.webhook.username,
                    avatar: config.webhook.avatar
                })
                    .send(config.webhook.events.fileUpload.replace(/{(.+?)}/g, (_, x) => replacers[x.trim()] || ''));
                if (fullData.length === req.files.length) {
                    let data;
                    if (req.headers.client) {
                        data = {
                            status: 200,
                            message: 'OK',
                            data: fullData
                        };
                    }
                    else {
                        data = { url: `${config.server.host}/${x._id}` };
                    }
                    return res.status(200).send(data);
                }
            })).catch((err) => {
                return res.status(500).send({
                    status: 500,
                    message: 'SERVER ERROR',
                    data: err
                });
            });
        }));
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let loggedUser;
    config.users.forEach((users) => {
        if (users.password === req.headers.authorization) {
            loggedUser = users;
        }
    });
    if (!loggedUser) {
        return res.status(403).send({
            status: 403,
            message: 'UNAUTHORIZED',
            data: []
        });
    }
    else {
        if (!req.params.id) {
            return res.status(400).send({
                status: 400,
                message: 'BAD REQUEST',
                data: []
            });
        }
        if (req.params.id === 'all') {
            const docs = yield uploads.find({});
            docs.forEach((f) => __awaiter(void 0, void 0, void 0, function* () {
                let x;
                yield uploads.findOne({ _id: f._id }).then((file) => x = file);
                yield uploads.deleteOne({
                    _id: f._id
                }).then(() => {
                    const replacers = {
                        user: loggedUser.username,
                        file: x._id,
                        size: x.fileSize / 1000 + 'KB',
                        type: x.fileType,
                        timestamp: x.uploadedAt,
                        link: `${config.server.host}/${x._id}`
                    };
                    new webcord({
                        url: config.webhook.url,
                        name: config.webhook.username,
                        avatar: config.webhook.avatar
                    })
                        .send(config.webhook.events.fileDelete.replace(/{(.+?)}/g, (_, x) => replacers[x.trim()] || ''));
                });
            }));
            fs.emptyDirSync(path.resolve(__dirname, "../../uploads/"));
            return res.status(200).send({
                status: 200,
                message: 'OK',
                data: []
            });
        }
        else {
            let x;
            yield uploads.findOne({ _id: req.params.id }).then((f) => x = f);
            yield uploads.deleteOne({
                _id: req.params.id
            })
                .then(() => {
                const replacers = {
                    user: loggedUser.username,
                    file: x._id,
                    size: x.fileSize / 1000 + 'KB',
                    type: x.fileType,
                    timestamp: x.uploadedAt,
                    link: `${config.server.host}/${x._id}`
                };
                new webcord({
                    url: config.webhook.url,
                    name: config.webhook.username,
                    avatar: config.webhook.avatar
                })
                    .send(config.webhook.events.fileDelete.replace(/{(.+?)}/g, (_, x) => replacers[x.trim()] || ''));
                fs.unlink(path.resolve(__dirname, "../../uploads/" + req.params.id))
                    .then(() => {
                    return res.status(200).send({
                        status: 200,
                        message: 'OK',
                        data: []
                    });
                })
                    .catch((e) => {
                    return res.status(500).send({
                        status: 500,
                        message: 'SERVER ERROR',
                        data: e
                    });
                });
            })
                .catch((e) => {
                return res.status(500).send({
                    status: 500,
                    message: 'SERVER ERROR',
                    data: e
                });
            });
        }
    }
}));
module.exports = router;
