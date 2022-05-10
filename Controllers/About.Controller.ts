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
import AboutList from "../Models/AboutList";
export class AboutController {
    constructor() {
        this.addNewAboutData = this.addNewAboutData.bind(this);
        this.getNewAboutData = this.getNewAboutData.bind(this);
        this.getNewAboutList = this.getNewAboutList.bind(this);
        
    }
    async addNewAboutData(req: Request, res: Response) {

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
                            var setbody: any = {}
                            setbody.phone = parseInt(dt.mobile);
                            setbody.name = dt.first_name + dt.last_name;
                            setbody.email = dt.email;
                            setbody.updatedID = new ObjectId(dt._id);
                            setbody.is_active = 0;
                            setbody.selected_date = body.date;
                            setbody.title = body.title;
                            setbody.text1 = body.text1;
                            setbody.text2 = body.text2;
                            setbody.text3 = body.text3;
                            setbody.text4 = body.text4;
                            setbody.text5 = body.text5;
                            setbody.created_on = new Date(Date());
                            
                            AboutList.create(setbody).then(result => {
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

    async getNewAboutData(req: Request, res: Response) {
        let headers = req.headers;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                            AboutList.findLatest().then(result => {
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
    async getNewAboutList(req: Request, res: Response) {
        let headers = req.headers;
        var dta: any = JSON.parse(req.params.data);
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                            AboutList.findAll(dta.is_active).then(result => {
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


export default new AboutController();