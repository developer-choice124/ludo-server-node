import { Request, Response, NextFunction } from "express";
import Config from "../Config/settings";
import AlertString from "../Config/alertstring";
import User from "../Models/User";
import Coin from "../Models/CoinList";
import UsersCoin from "../Models/UsersCoin";
import { ObjectId } from "mongodb";
import RedeemCoin from "../Models/RedeemCoin";
import RoomCoin from "../Models/RoomCoinList";
import * as shortid from "shortid";
import AdminUser from "../Models/AdminUser";
import UpdateAppList from "../Models/UpdateAppList";
export class UpdateAppController {
    constructor() {
        this.addNewUpdateList = this.addNewUpdateList.bind(this);
        this.getNewUpdateData = this.getNewUpdateData.bind(this);
        this.getNewUpdateList = this.getNewUpdateList.bind(this);
        
    }
    async addNewUpdateList(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                        const email = { "email": body.email };
                        // res.json({  "pass": this.AESencode(Config.superSecret,body.password) });
                        AdminUser.find(email).then(result => {
                            var dt: any = result;
                            res.status(200).send({
                                "data": result,
                                "errorvalue": false
                            });
                            var setbody: any = {}
                            setbody.phone = parseInt(dt.mobile);
                            setbody.name = dt.first_name + dt.last_name;
                            setbody.email = dt.email;
                            setbody.updatedID = new ObjectId(dt._id);
                            setbody.is_active = 0;
                            setbody.selected_date = body.date;
                            setbody.type = body.type;
                            setbody.version = body.version;
                            setbody.link = body.link;
                            setbody.whatsnew = body.whatsnew;
                            setbody.version_type = body.version_type;
                            setbody.created_on = new Date(Date());
                            
                            UpdateAppList.create(setbody).then(result => {
                                var dtx: any = result;
                                res.status(200).send({
                                    "data": dtx,
                                    "errorvalue": false
                                });
                            }).catch((err: any) => {
                                res.status(403).send({
                                    "error": err,
                                    "errorvalue": true
                                });
                            });

                        }).catch((err: any) => {
                            res.status(401).send({
                                "error": err,
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
                    "error": AlertString.adminHeaderInvalid,
                    "errorvalue": true
                });
            }
        } else {
            res.status(403).send({
                "error": AlertString.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    }

    async getNewUpdateData(req: Request, res: Response) {
        let headers = req.headers;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                            UpdateAppList.findLatest().then(result => {
                                var dtx: any = result;
                                res.status(200).send({
                                    "data": dtx,
                                    "errorvalue": false
                                });
                            }).catch((err: any) => {
                                res.status(200).send({
                                    "error": err,
                                    "errorvalue": true
                                });
                            });

                    } else {
                        res.status(200).send({
                            "error": AlertString.JWTissue,
                            "errorvalue": true
                        });
                    }
                }).catch((err: any) => {
                    res.status(200).send({
                        "error": err,
                        "errorvalue": true
                    });
                });

            } else {
                res.status(200).send({
                    "error": AlertString.adminHeaderInvalid,
                    "errorvalue": true
                });
            }
        } else {
            res.status(200).send({
                "error": AlertString.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    }
    async getNewUpdateList(req: Request, res: Response) {
        let headers = req.headers;
        var dta: any = JSON.parse(req.params.data);
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                            UpdateAppList.findAll(dta.is_active).then(result => {
                                var dtx: any = result;
                                res.status(200).send({
                                    "data": dtx,
                                    "errorvalue": false
                                });
                            }).catch((err: any) => {
                                res.status(403).send({
                                    "error": err,
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
                    "error": AlertString.adminHeaderInvalid,
                    "errorvalue": true
                });
            }
        } else {
            res.status(403).send({
                "error": AlertString.adminHeaderInvalid,
                "errorvalue": true
            });
        }
    }

}


export default new UpdateAppController();