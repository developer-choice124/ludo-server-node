import { Router, Request, Response, NextFunction } from "express";
import User from "../Models/User";
import Coin from "../Models/CoinList";
import Config from "../Config/settings";
import AlertString from "../Config/alertstring";
import { ObjectId } from "mongodb";
import AdminUser from "../Models/AdminUser";
import alertstring from "../Config/alertstring";
var clickatell = require("clickatell-platform");
var generator = require('generate-password');

var CryptoJS = require("crypto-js");

class UserController {
    constructor() {
        this.register = this.register.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.getUserDetail = this.getUserDetail.bind(this);
        this.detailUser = this.detailUser.bind(this);
        this.login = this.login.bind(this);
        this.forgetPassword = this.forgetPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.AESencrypt = this.AESencrypt.bind(this);
        this.AESdecrypt = this.AESdecrypt.bind(this);
    }

    async register(req: Request, res: Response, next: NextFunction) {
        let body = req.body;
        body.is_active = 0;

        // Randam OTP Generation Limits
        const min = 100000;
        const max = 999999;

        body.otp = Math.floor(Math.random() * (max - min + 1) + min);

        const checked_data = { phone: body.phone };

        User.check(checked_data).then(result => {
            if (result == 0) {
                body.usercoins = 0;
                User.create(body).then(result => {
                    var dt: any = result;
                    var data = {
                        'phone': dt[0].phone,
                        '_id': dt[0]._id,
                    }

                    var phonrnumber = "+91" + dt[0].phone;
                    // TODO Send Code via SMS
                    clickatell.sendMessageRest(Config.SMSTEXT + body.otp, [phonrnumber], Config.SMSAPIKEY);
                    res.json({ "data": data, "errorvalue": false });

                }).catch((err: any) => {
                    res.json({ "error": err, "errorvalue": true });
                });
            } else {
                const updated_data_id = { "phone": body.phone };
                const updated_data = {
                    $set: { "is_active": 0, "otp": body.otp }
                };
                User.update(updated_data_id, updated_data).then(result => {

                    User.find(updated_data_id).then(result => {
                        var dt: any = result;
                        let data = {
                            '_id': dt._id,
                            'phone': dt.phone,
                        };
                        // TODO Revisit Send Code via SMS
                        var phonrnumber = "+91" + dt.phone;
                        // TODO Send Code via SMS
                        clickatell.sendMessageRest(Config.SMSTEXT + body.otp, [phonrnumber], Config.SMSAPIKEY);
                        res.json({ "data": data, "errorvalue": false });

                    }).catch((err: any) => {
                        res.json({ "error": err, "errorvalue": true });
                    });
                }).catch((err: any) => {
                    res.json({ "error": err, "errorvalue": true });
                });
            }
        }).catch((err: any) => {
            res.json({ "error": err });
        });

    }
    async verifyUser(req: Request, res: Response, next: NextFunction) {
        let body = req.body;

        if (body.phone && body.otp) {

            const phone = { "phone": body.phone };
            await User.find(phone).then(result => {

                var dt: any = result;
                if (dt._id == body._id) {

                    // DONE Otp Check From the User
                    if (dt.otp == body.otp) {
                        const updated_data_id = { "phone": body.phone };
                        const updated_data = {
                            $set: { "is_active": 1 }
                        };
                        User.update(updated_data_id, updated_data).then(result => {
                            var payload = {
                                phone: body.phone,
                                id: body._id,
                                superSecret: Config.superSecret,
                            };
                            // DONE JWT Create Using User ID and PayLoad and Phone
                            User.jwtCreate(payload, Config.privateKEY, Config.signOptions).then(result => {
                                if (dt.username) {
                                    res.json({ "data": { "token": result, "existinguser": true, "name": dt.name, "username": dt.username, "userprofile": dt.userprofile, "usercoins": dt.usercoins }, "errorvalue": false });
                                } else {
                                    res.json({ "data": { "token": result, "existinguser": false }, "errorvalue": false });
                                }
                            }).catch((err: any) => {
                                res.json({ "error": err, "errorvalue": true });
                            });

                        }).catch((err: any) => {
                            res.json({ "error": err, "errorvalue": true });
                        });
                    } else {
                        res.json({ "error": AlertString.otperror, "errorvalue": true });
                    }
                } else {
                    res.json({ "error": AlertString.idmatch, "errorvalue": true });
                }

            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });

        } else {
            res.json({ "error": AlertString.errfields, "errorvalue": true });
        }
    }
    async getUserDetail(req: Request, res: Response, next: NextFunction) {
        let header = req.headers;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const id = { _id: new ObjectId(data.id) };
                    User.find(id).then(result => {
                        var dt: any = result;
                        let data = {
                            '_id': dt._id,
                            'phone': dt.phone,
                            'name': dt.name,
                            'usercoins': dt.usercoins,
                            'username': dt.username,
                            'userprofile': dt.userprofile,
                        };

                        res.json({ "data": data, "errorvalue": false });
                    }).catch((err: any) => {
                        res.json({ "error": err, "errorvalue": true });
                    });
                }

            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }
    async detailUser(req: Request, res: Response, next: NextFunction) {
        let body = req.body;
        let header = req.headers;
        if (body.name && body.username) {


            if (header.authorization) {
                var jwt = header.authorization.split(" ");
                await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                        // DONE User Details Update
                        // res.json({ "data": data.phone , "errorvalue": false});
                        const updated_data_id = { "phone": data.phone };
                        const updated_data = {
                            $set: {
                                "name": body.name,
                                "username": body.username,
                                "userprofile": body.userprofile
                            }
                        };
                        User.update(updated_data_id, updated_data).then(resultx => {
                            var dataext: any = resultx;


                            if (dataext.modifiedCount == 1) {

                                const phonesearch = { "phone": data.phone };

                                User.find(phonesearch).then(result => {
                                    var dt: any = result;
                                    console.log(dt);
                                    res.json({
                                        "data": {
                                            "status": AlertString.userupdatesuccess,
                                            "phone": dt.phone,
                                            "_id": dt.id,
                                            "name": dt.name,
                                            "usercoins": dt.usercoins,
                                            "username": dt.username,
                                            "userprofile": dt.userprofile
                                        }, "errorvalue": false
                                    });

                                }).catch((err: any) => {
                                    res.json({ "error": err, "errorvalue": true });
                                });

                            } else {
                                res.json({ "error": AlertString.userUpdateChange, "errorvalue": true });
                            }
                        }).catch((err: any) => {
                            res.json({ "error": err, "errorvalue": true });
                        });
                    }
                }).catch((err: any) => {
                    res.json({ "error": err, "errorvalue": true });
                });
            } else {
                res.json({ "error": AlertString.authdont, "errorvalue": true });
            }
        } else {
            res.json({ "error": AlertString.errfields, "errorvalue": true });
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        let headers = req.headers;
        let body = req.body;

        if (headers.apisecret == Config.superSecret) {
            if (body.user_type == 1) {

                const email = { "email": body.email };
                // res.json({  "pass": this.AESencode(Config.superSecret,body.password) });

                AdminUser.find(email).then(result => {
                    var dt: any = result;


                    // DONE Creating A new password in the Database

                    // var encryptedData = this.AESencrypt(body.password,Config.superSecret);
                    // var edata = encryptedData.toString();
                    // var updated_data = {
                    //     $set: {
                    //         "password": edata
                    //     }
                    // };
                    // AdminUser.update(email, updated_data).then(result => {
                    //     var dta: any = result;
                    //     res.json({ "data": dta, "errorvalue": false });
                    // }).catch((err: any) => {
                    //     console.log(err);
                    //     res.json({ "error": err, "errorvalue": true });
                    // });

                    if (body.password == this.AESdecrypt(dt.password, Config.superSecret)) {
                        var payload = {
                            phone: dt.mobile,
                            id: dt._id,
                            superSecret: Config.superSecret,
                        };
                        User.jwtCreate(payload, Config.privateKEY, Config.signOptions).then(result => {
                            var data: any = result;
                            if (data) {
                                res.json({
                                    "token": data,
                                    "user_id": dt._id,
                                    "first_name": dt.first_name,
                                    "last_name": dt.last_name,
                                    "mobile": dt.mobile,
                                    "summary": dt.summary,
                                    "profile_image": dt.profile_image,
                                    "email": dt.email,
                                    "login_type": dt.login_type,
                                    "is_admin": dt.is_admin,
                                });
                            } else {
                                res.status(400).send({
                                    "msg": alertstring.adminJWTIssue,
                                    "errorvalue": true
                                });
                            }
                        }).catch((err: any) => {
                            res.json({ "msg": err, "errorvalue": true });
                        });

                    } else {
                        // res.json({ "error": alertstring.adminPassWrong, "errorvalue": true });
                        res.status(401).send({
                            "msg": alertstring.adminPassWrong,
                            "errorvalue": true
                        });
                    }
                }).catch((err: any) => {
                    // res.json({ "error": err, "errorvalue": true });
                    res.status(401).send({
                        "msg": alertstring.adminemailWrong,
                        "errorvalue": true
                    });
                });
            }
        } else {
            res.status(403).send({
                "msg": alertstring.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    }
    async forgetPassword(req: Request, res: Response, next: NextFunction) {

        let headers = req.headers;
        let body = req.body;

        if (headers.apisecret == Config.superSecret) {
            const email = { "email": body.email };
            AdminUser.find(email).then(result => {
                var dt: any = result;
                if (dt) {
                    var password = generator.generate({
                        length: 10,
                        numbers: true
                    });
                    var phonrnumber = "+91" + dt.mobile;
                    clickatell.sendMessageRest(Config.SMSPASSTEXT + password, [phonrnumber], Config.SMSAPIKEY);
                    var encryptedData = this.AESencrypt(password, Config.superSecret);
                    var edata = encryptedData.toString();
                    var updated_data = {
                        $set: {
                            "password": edata
                        }
                    };

                    AdminUser.update(email, updated_data).then(result => {
                        var dta: any = result;
                        res.json({ "data": dta, "errorvalue": false });
                        // res.json({ "data": password, "errorvalue": false });
                    }).catch((err: any) => {
                        res.json({ "error": err, "errorvalue": true });
                    });

                } else {
                    res.status(401).send({
                        "error": alertstring.adminemailWrongdb,
                        "errorvalue": true
                    });
                }

            }).catch((err: any) => {
                res.status(401).send({
                    "error": alertstring.adminemailWrongdb,
                    "errorvalue": true
                });
            });
        } else {
            res.status(403).send({
                "error": alertstring.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction) {

        let headers = req.headers;
        let body = req.body;
        
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {
                        const email = { "email": body.email };
                        AdminUser.find(email).then(result => {
                            var dt: any = result;
                            if (dt) {
                                if(this.AESdecrypt(dt.password, Config.superSecret).toString()==body.old){
                                    var phonrnumber = "+91" + dt.mobile;
                                    clickatell.sendMessageRest(Config.SMSNEWPASSTEXT + body.new, [phonrnumber], Config.SMSAPIKEY);
                                    var encryptedData = this.AESencrypt(body.new, Config.superSecret);
                                    var edata = encryptedData.toString();
                                    var updated_data = {
                                        $set: {
                                            "password": edata
                                        }
                                    };
                                    AdminUser.update(email, updated_data).then(result => {
                                        var dta: any = result;
                                        res.json({ "data": "Your New Password has been Updated !", "errorvalue": false });
                                    }).catch((err: any) => {
                                        res.json({ "error": err, "errorvalue": true });
                                    });

                                } else {
                                    res.status(401).send({
                                        "error": alertstring.adminOldPassWrong,
                                        "errorvalue": true
                                    });
                                }
                            } else {
                                res.status(401).send({
                                    "error": alertstring.adminemailWrongdb,
                                    "errorvalue": true
                                });
                            }
            
                        }).catch((err: any) => {
                            res.status(401).send({
                                "error": alertstring.adminemailWrongdb,
                                "errorvalue": true
                            });
                        });

                    } else {
                        res.status(401).send({
                            "error": AlertString.JWTissue,
                            "errorvalue": true
                        });
                    }
                }).catch((err: any) => {
                    res.status(401).send({
                        "error": err,
                        "errorvalue": true
                    });
                });

            } else {
                res.status(403).send({
                    "error": alertstring.adminHeaderInvalid,
                    "errorvalue": true
                });
            }
        } else {
            res.status(403).send({
                "error": alertstring.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    
    }
    AESencrypt(text: any, passPhrase: any) {
        return CryptoJS.AES.encrypt(text, passPhrase);
    }
    AESdecrypt(text: any, passPhrase: any) {
        var bytes = CryptoJS.AES.decrypt(text.toString(), passPhrase);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

export default new UserController();