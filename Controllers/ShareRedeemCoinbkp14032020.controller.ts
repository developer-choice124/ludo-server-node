import { Request, Response, NextFunction } from "express";
import Config from "../Config/settings";
import AlertString from "../Config/alertstring";
import User from "../Models/User";
import ShareRedeemCoin from "../Models/ShareRedeemCoin";
// import Coin from "../Models/CoinList";
// import UsersCoin from "../Models/UsersCoin";
import { ObjectId } from "mongodb";
// import RedeemCoin from "../Models/RedeemCoin";
// import RoomCoin from "../Models/RoomCoinList";
// import * as shortid from "shortid";
export class ShareRedeemCoinController {
    constructor() {
        this.createShareRedeem = this.createShareRedeem.bind(this);
        this.checkShareRedeem = this.checkShareRedeem.bind(this);
        this.updateShareRedeem = this.updateShareRedeem.bind(this);
        this.getShareRedeemlist = this.getShareRedeemlist.bind(this);
    }

    datacareer1:any;
    datacareer2:any;
    datacareer3:any;
    datacareer4:any;
    datacareer5:any;
    datacareer6:any;
    async createShareRedeem(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.authorization) {
            var jwt = headers.authorization.split(" ");
            User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const updated_data_id = { reqid: new ObjectId(data.id) };
                    ShareRedeemCoin.find(updated_data_id).then(result => {
                        var dta: any = result;
                        if (dta) {
                            res.status(200).send({
                                "error": "You have already used the Referral code to get your free Coins",
                                "errorvalue": true
                            });
                        } else {
                            var setbody: any = {}
                            setbody.req_phone = parseInt(data.phone);
                            setbody.reqid = new ObjectId(data.id);
                            setbody.req_to_phone = parseInt(body.phone);
                            setbody.is_active = 0;
                            setbody.created_on = new Date(Date());
                            ShareRedeemCoin.create(setbody).then(result => {
                                var dt: any = result;
                                this.datacareer1 = dt[0].reqid;
                                this.datacareer6 = dt[0]._id;
                                const updated_data_id = { _id: new ObjectId(dt[0].reqid) };
                                User.find(updated_data_id).then(result => {
                                    var dty: any = result;
                                    var addedfive = dty.usercoins + 5;
                                    this.datacareer2 = dty.usercoins;
                                    this.datacareer3 = addedfive;
                                    const updated_data_id = { _id: new ObjectId(dty._id) };
                                    const updated_data = {
                                        $set: { "usercoins": addedfive, "updated_on": new Date(Date()) }
                                    };
                                    User.update(updated_data_id, updated_data).then(result => {
                                        var notify: any = result;

                                        if (notify.result.nModified == 1) {
                                            const updated_data_id = { phone: body.phone };
                                            User.find(updated_data_id).then(result => {
                                                var dtx: any = result;
                                                const addedten: number = dtx.usercoins + 10;
                                                this.datacareer4 = dtx.usercoins;
                                                this.datacareer5 = addedten;
                                                const updated_data_id = { phone: body.phone };
                                                const updated_data = {
                                                    $set: { "usercoins": addedten, "updated_on": new Date(Date()) }
                                                };
                                                User.update(updated_data_id, updated_data).then(result => {
                                                    var data: any = result;


                                                    if (data.result.nModified == 1) {

                                                        const updated_data_id = { _id: new ObjectId(this.datacareer6) };
                                                        const updated_data = {
                                                            $set: { "usercoinsbefore": this.datacareer2
                                                            , "usercoinsafter": this.datacareer3
                                                            , "reffereduserbefore": this.datacareer4
                                                            , "reffereduserafter": this.datacareer5
                                                            ,"updated_on": new Date(Date()) }
                                                        };
                                                        // console.log(updated_data_id);
                                                        // console.log(updated_data);

                                                        ShareRedeemCoin.update(updated_data_id, updated_data).then(result => {
                                                            var data: any = result;
        

                                                            if (data.result.nModified == 1) {
                                                                res.status(200).send({
                                                                    "data": "Your Referrer Has been Successfully Added.",
                                                                    "errorvalue": false
                                                                });
                                                            }
                                                        
                                                        }).catch((err: any) => {
                                                            res.status(200).send({
                                                                "error": err,
                                                                "errorvalue": true
                                                            });
                                                        });

                                                    }

                                                }).catch((err: any) => {
                                                    res.status(200).send({
                                                        "error": err,
                                                        "errorvalue": true
                                                    });
                                                });
                                            }).catch((err: any) => {
                                                res.status(200).send({
                                                    "error": err,
                                                    "errorvalue": true
                                                });
                                            });
                                        }

                                    }).catch((err: any) => {
                                        res.status(200).send({
                                            "error": err,
                                            "errorvalue": true
                                        });
                                    });

                                }).catch((err: any) => {
                                    res.status(200).send({
                                        "error": err,
                                        "errorvalue": true
                                    });
                                });

                            }).catch((err: any) => {
                                res.status(200).send({
                                    "error": err,
                                    "errorvalue": true
                                });
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
    async checkShareRedeem(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.authorization) {
            var jwt = headers.authorization.split(" ");
            User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const updated_data_id = { reqid: new ObjectId(data.id) };
                    ShareRedeemCoin.find(updated_data_id).then(result => {
                        var dta: any = result;
                        if (dta) {
                            res.status(200).send({
                                "error": "You have already used the Referral code to get your free Coins",
                                "errorvalue": true
                            });
                        } else {
                            res.status(200).send({
                                "error": "You have already used the Referral code to get your free Coins",
                                "errorvalue": false
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
    async updateShareRedeem(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.authorization) {
            var jwt = headers.authorization.split(" ");
            User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {


                    const updated_data_id = { _id: new ObjectId(body._id) };
                    const updated_data = {
                        $set: { "is_active": 1, "updated_on": new Date(Date()) }
                    };
                    ShareRedeemCoin.update(updated_data_id, updated_data).then(result => {
                        var data: any = result;


                        if (data.result.nModified == 1) {

                            res.status(200).send({
                                "data": "Payment has been Updated. Money transfered to User",
                                "errorvalue": false
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

    async getShareRedeemlist(req: Request, res: Response) {

        let headers = req.headers;
        let body: any = JSON.parse(req.params.data);
        if (headers.authorization) {
            var jwt = headers.authorization.split(" ");
            User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    // res.status(200).send({
                    //     "data": body,
                    //     "errorvalue": false
                    // });

                    switch (body.payment_status) {
                        case true:
                            ShareRedeemCoin.findAllConditionalCheck(body).then((result: any) => {
                                var data: any = result;
                                if (data) {
                                    res.status(200).send({
                                        "data": data,
                                        "errorvalue": false
                                    });
                                }
                            }).catch((err: any) => {
                                res.status(200).send({
                                    "error": err,
                                    "errorvalue": true
                                });
                            });
                            break;
                        case false:
                            ShareRedeemCoin.findAllConditionalCheck(body).then((result: any) => {
                                var data: any = result;
                                if (data) {
                                    res.status(200).send({
                                        "data": data,
                                        "errorvalue": false
                                    });
                                }
                            }).catch((err: any) => {
                                res.status(200).send({
                                    "error": err,
                                    "errorvalue": true
                                });
                            });
                            break;
                    }

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


}


export default new ShareRedeemCoinController();