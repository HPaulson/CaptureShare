import { builtinModules } from 'module';

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const config = require('../../config.json');
const uploads = require('../../database/main.schema').Uploads;
const fs = require('fs-extra');
const path = require('path');
const webcord = require('webcord');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req: any, file: any, cb: (arg0: any, arg1: string) => void) {
		cb(null, path.resolve(`${__dirname}../../uploads/`));
	},

	filename: function(
		req: any,
		file: {
			size: number;
			originalname: string;
		},
		cb: (arg0: any, arg1: any) => void
	) {
		const extLen = file.originalname.split('.').length - 1;

		const extension = file.originalname.split('.')[extLen];

		if (config.server.notAllowed.includes(extension)) {
			return cb(
				{
					status: 400,
					message: 'BAD REQUEST',
					reason: 'BAD FILETYPE'
				},
				false
			);
		} else {
			if (config.server.useOriginalName) {
				if (file.originalname.includes('../')) {
					const len = file.originalname.split('../').length;

					file.originalname = file.originalname.split('../')[len - 1];
				}

				if (fs.existsSync(path.resolve(`${__dirname}../../uploads/${file.originalname}`))) {
					return cb(
						{
							status: 409,
							message: 'CONFLICT',
							reason: 'FILE EXISTS'
						},
						false
					);
				} else {
					return cb(null, file.originalname);
				}
			} else {
				function str(length: number) {
					let result: string = '';
					let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

					for (let i = 0; i < length; i++) {
						result += letters.charAt(Math.floor(Math.random() * letters.length));
					}

					if (fs.existsSync(path.resolve(`${__dirname}../../uploads/${result}`))) {
						return str(config.server.nameLength);
					} else {
						const len = file.originalname.split('.').length - 1;
						return `${result}.${file.originalname.split('.')[len]}`;
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

router.get(
	'/',
	async (
		req: any,
		res: {
			status: (
				arg0: number
			) => {
				(): any;
				new (): any;
				send: {
					(
						arg0: {
							data: any;
							status: number;
							message: string;
						}
					): any;
					new (): any;
				};
			};
		}
	) => {
		let loggedUser: {
			username: string;
			password: string;
		};

		config.users.forEach((users: { password: string; username: string }) => {
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
		} else {
			return res.status(200).send({
				status: 200,
				message: 'OK',
				data: await uploads.find({
					user: loggedUser.username
				})
			});
		}
	}
);

router.post(
	'/',
	upload.array('file', 12),
	async (
		req: {
			headers: any;
			files: any[];
			body: any;
		},
		res: {
			send: (arg0: any) => void;
			status: (
				arg0: number
			) => {
				(): any;
				new (): any;
				send: {
					(
						arg0: {
							status: number;
							data: any;
							message: string;
						}
					): any;
					new (): any;
				};
			};
		}
	) => {
		let loggedUser: {
			username: any;
		};

		config.users.forEach((users: { password: string; username: string }) => {
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
		} else {
			let fullData = [];

			await req.files.forEach(async (f: { filename: any; mimetype: any; size: any }) => {
				await uploads
					.create({
						_id: f.filename,

						uploadedAt: new Date(),

						user: loggedUser.username,

						fileType: f.mimetype,

						fileSize: f.size
					})
					.then(async (x: any) => {
						await fullData.push({
							status: 201,
							message: 'CREATED',
							data: x
						});

						const replacers = {
							user: loggedUser.username,
							file: x._id,
							size: `${x.fileSize / 1000}KB`,
							type: x.fileType,
							timestamp: x.uploadedAt,
							link: `${config.server.host}/${x._id}`
						};

						new webcord({
							url: config.webhook.url,
							name: config.webhook.username,
							avatar: config.webhook.avatar
						}).send(
							config.webhook.events.fileUpload.replace(
								/{(.+?)}/g,
								(_: any, x: string) => replacers[x.trim()] || ''
							)
						);

						if (fullData.length === req.files.length) {
							let data: any;
							if (req.headers.client) {
								data = {
									status: 200,
									message: 'OK',

									data: fullData
								};
							} else {
								data = { url: `${config.server.host}/${x._id}` };
							}

							return res.status(200).send(data);
						}
					})
					.catch((err: any) => {
						return res.status(500).send({
							status: 500,
							message: 'SERVER ERROR',
							data: err
						});
					});
			});
		}
	}
);

router.delete(
	'/:id',
	async (
		req: {
			headers: { authorization: string };
			params: { id: string };
		},
		res: {
			status: (
				arg0: number
			) => {
				(): any;
				new (): any;
				send: {
					(
						arg0: {
							status: number;
							message: string;
							data: any;
						}
					): any;
					new (): any;
				};
			};
		}
	) => {
		let loggedUser: {
			username: string;
			password: string;
		};

		config.users.forEach((users: { password: string; username: string }) => {
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
		} else {
			if (!req.params.id) {
				return res.status(400).send({
					status: 400,
					message: 'BAD REQUEST',
					data: []
				});
			}

			if (req.params.id === 'all') {
				const docs = await uploads.find({});
				docs.forEach(async (f: { _id: any }) => {
					let x: any;
					await uploads.findOne({ _id: f._id }).then((file: any) => (x = file));
					await uploads
						.deleteOne({
							_id: f._id
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
							}).send(
								config.webhook.events.fileDelete.replace(
									/{(.+?)}/g,
									(_: any, x: string) => replacers[x.trim()] || ''
								)
							);
						});
				});

				fs.emptyDirSync(path.resolve(`${__dirname}../../uploads/`));

				return res.status(200).send({
					status: 200,
					message: 'OK',
					data: []
				});
			} else {
				let x: any;
				await uploads.findOne({ _id: req.params.id }).then((f: any) => (x = f));
				await uploads
					.deleteOne({ _id: req.params.id })
					.then(() => {
						const replacers = {
							user: loggedUser.username,
							file: x._id,
							size: `${x.fileSize / 1000}KB`,
							type: x.fileType,
							timestamp: x.uploadedAt,
							link: `${config.server.host}/${x._id}`
						};

						new webcord({
							url: config.webhook.url,
							name: config.webhook.username,
							avatar: config.webhook.avatar
						}).send(
							config.webhook.events.fileDelete.replace(
								/{(.+?)}/g,
								(_: any, x: string) => replacers[x.trim()] || ''
							)
						);
						fs
							.unlink(path.resolve(`${__dirname}../../uploads/${req.params.id}`))
							.then(() => {
								return res.status(200).send({
									status: 200,
									message: 'OK',
									data: []
								});
							})
							.catch((e: Error) => {
								return res.status(500).send({
									status: 500,
									message: 'SERVER ERROR',
									data: e
								});
							});
					})
					.catch((e: Error) => {
						return res.status(500).send({
							status: 500,
							message: 'SERVER ERROR',
							data: e
						});
					});
			}
		}
	}
);

module.exports = router;
