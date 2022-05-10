import { Request, Response, NextFunction } from "express";
import Config from "../Config/settings";
import AlertString from "../Config/alertstring";
import User from "../Models/User";
import { ObjectId } from "mongodb";
import * as shortid from "shortid";
import AdminUser from "../Models/AdminUser";
import FeedbackUser from "../Models/FeedbackUser";
export class FeedbackUserController {
    constructor() {
        this.addFeedbackUser = this.addFeedbackUser.bind(this);
        this.getFeedbackUser = this.getFeedbackUser.bind(this);
        
    }
    async addFeedbackUser(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {
                        
                        const id = { _id: new ObjectId(data.id) };
                        User.find(id).then(result => {
                            var dt:any = result;
                            var data:any = {};
                            data.phone = dt.phone;
                            data.userID = dt._id;
                            data.name = dt.name;
                            data.username = dt.username;
                            data.usercoins = dt.usercoins;
                            data.userprofile_create_time = dt.updated_on;
                            data.comment = body.message;
                            data.created_on = new Date();
                            data.is_active = 1;

                            FeedbackUser.create(data).then(result => {
                                res.status(200).send({
                                    "data": "Data Updated SucessFully",
                                    "errorvalue": false
                                });
                            }).catch((err: any) => {
                                res.status(200).send({
                                    "error": err,
                                    "errorvalue": true
                                });
                            });
                        
                        
                    }).catch((err: any) => {
                        
                        res.status(200).send({
                            "error":err,
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
    }

    async getFeedbackUser(req: Request, res: Response) {
        let headers = req.headers;
        var dta: any = JSON.parse(req.params.data);

        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {
                        var criteria: any = dta;
                        FeedbackUser.findSearchedAll(criteria).then(result => {
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


export default new FeedbackUserController();