import * as PaytmParam from './Paytm/Paytm.Controller';
import * as shortid from 'shortid';
import AlertString from '../Config/alertstring';
import alertstring from '../Config/alertstring';
import Coin from '../Models/CoinList';
import Config from '../Config/settings';
import RedeemCoin from '../Models/RedeemCoin';
import RoomCoin from '../Models/RoomCoinList';
import Roomdetails from '../Models/RoomDetails';
import User from '../Models/User';
import UsersCoin from '../Models/UsersCoin';
import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export class CoinController {
    constructor() {
        this.getCoinList = this.getCoinList.bind(this);
        this.getCoinDetailbyID = this.getCoinDetailbyID.bind(this);
        this.putCoinList = this.putCoinList.bind(this);
        this.chargePerRoomCoins = this.chargePerRoomCoins.bind(this);
        this.winnerCoinsUpdate = this.winnerCoinsUpdate.bind(this);
        this.buyCoins = this.buyCoins.bind(this);
        this.updatePaymentId = this.updatePaymentId.bind(this);
        this.getRoomCoinList = this.getRoomCoinList.bind(this);
        this.getRedeemdata = this.getRedeemdata.bind(this);
        this.getUserTransaction = this.getUserTransaction.bind(this);
        this.putRoomCoinList = this.putRoomCoinList.bind(this);
        this.deleteRoomCoinList = this.deleteRoomCoinList.bind(this);
        this.deleteCoinList = this.deleteCoinList.bind(this);
        this.userCoinsRepayMoney = this.userCoinsRepayMoney.bind(this);
        

    }

    async getCoinList(req: Request, res: Response) {
        let header = req.headers;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {

                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    // DONE Get the Coins List
                    // res.json({ "data": body, "errorvalue": false});
                    Coin.findAll().then(result => {
                        res.json({ "data": result, "errorvalue": false });
                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                    // res.json({ "data": { "token" : result } , "errorvalue": false});
                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }

            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }

    async getCoinDetailbyID(req: Request, res: Response) {
        let header = req.headers;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {

                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    // DONE Get the Coins List
                    // res.json({ "data": body, "errorvalue": false});
                    Coin.findAll().then(result => {
                        res.json({ "data": result, "errorvalue": false });
                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                    // res.json({ "data": { "token" : result } , "errorvalue": false});
                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }

            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }

    async putCoinList(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    var setbody: any = {};
                    // DONE Additional Field while Creating Coins           
                    setbody.price = body.price;
                    setbody.coins = body.coins;
                    setbody.is_active = 1;
                    Coin.create(setbody).then(result => {
                        res.json({ "data": result, "errorvalue": false });
                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }


            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }

    async chargePerRoomCoins(req: Request, res: Response) {
        0
        let header = req.headers;
        let body = req.body;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const id = { _id: new ObjectId(data.id) };
                    User.find(id).then(result => {
                        var dt: any = result;

                        const id = { _id: new ObjectId(body._id) };
                        RoomCoin.find(id).then(resultx => {
                            var dtx: any = resultx;
                            if (dt.usercoins >= dtx.coins) {
                                res.json({ "data": { "remaining-coins": "hola" }, "errorvalue": false });
                            } else {
                                res.json({ "error": AlertString.userCoinsNotAvailable, "errorvalue": true });
                            }
                        }).catch((err: any) => {
                            res.json({ "error": err, "errorvalue": true });
                        });
                    }).catch((err: any) => {
                        res.json({ "error": err, "errorvalue": true });
                    });
                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }
            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }

    async winnerCoinsUpdate(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    const id = { _id: new ObjectId(data.id) };
                    User.find(id).then(result => {
                        var dt: any = result;

                        const id = { _id: new ObjectId(body._id) };
                        RoomCoin.find(id).then(resultx => {

                            var dtx: any = resultx;
                            var coinsremain = dt.usercoins + dtx.coins;
                            var updated_data_id = { _id: new ObjectId(dt._id) };
                            var updated_data = {
                                $set: { "usercoins": coinsremain }
                            };
                            User.update(updated_data_id, updated_data).then(() => {
                                res.json({ "data": { "remainingcoins": coinsremain }, "errorvalue": false });
                            }).catch((err: any) => {
                                console.log(err);
                                res.json({ "error": err, "errorvalue": true });
                            });

                        }).catch((err: any) => {
                            res.json({ "error": err, "errorvalue": true });
                        });



                    }).catch((err: any) => {
                        res.json({ "error": err, "errorvalue": true });
                    });
                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }
            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });
        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }
    }

    async buyCoins(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    const id = { _id: new ObjectId(body._id) };

                    Coin.find(id).then(result => {
                        var dtx: any = result;

                        // console.log(body);
                        var indata: any = {};

                        // from the JWT Key Details
                        indata.phone = data.phone;
                        indata._userId = new ObjectId(data.id);

                        // From body of the Post
                        indata.coins = dtx.coins;
                        indata.price = dtx.price;

                        // FRom Setting on Current Time
                        indata.is_active = 0;
                        indata.updated_on = new Date(Date());
                        indata.randShortId = shortid.generate()
                        // console.log(indata);
                        // res.json({ "setdata": indata, "errorvalue": true });

                        UsersCoin.create(indata).then(result => {
                            var setdata: any = result;
                            // res.json({ "setdata": setdata, "errorvalue": true });

                            res.json({
                                "data": {
                                    "orderID": setdata[0]._id
                                }, "errorvalue": false
                            });

                            // TODO Paytm Setup

                            //   DONE Razerpay                      
                            /*
                                                        Razorpay Take Money from the Client.
                            */

                            /*
                                var options = {
                                    amount: setdata[0].price * 100,  // amount in the smallest currency unit
                                    currency: "INR",
                                    receipt: JSON.stringify(setdata[0]._id),
                                    payment_capture: '1',
                                    notes: [JSON.stringify({ "phone": setdata[0].phone, "_userId": setdata[0]._userId, "updatedtime": setdata[0].updated_on })]
                                };
                                var instance = new Razorpay({
                                    key_id: Config.key_id,
                                    key_secret: Config.key_secret,
                                });
                                instance.orders.create(options, function (err: any, order: any) {
                                    // console.log(order);
                                    var order_data = order;
                                    var compareid = JSON.parse(order_data.receipt);
    
                                    var updated_data_id = { _id: new ObjectId(compareid) };
                                    var updated_data = {
                                        $set: { "_reciptId": order_data.id }
                                    };
                                    // console.log(updated_data_id);
                                    UsersCoin.update(updated_data_id, updated_data).then(result => {
    
                                        const id = { _id: new ObjectId(data.id) };
                                        // console.log(id);
                                        User.find(id).then(result => {
                                            var dt: any = result;
                                            var urlstring = Config.gatewayurl + "payment.php?name=" + dt.name + "&amt=" + setdata[0].price + "&mob=" + dt.phone + "&orderID=" + order_data.id;
                                            console.log(urlstring);
                                            res.json({
                                                "data": {
                                                    "url": urlstring.toString()
                                                }, "errorvalue": false
                                            });
    
    
                                        }).catch((err: any) => {
                                            res.json({ "error": err, "errorvalue": true });
                                        });
    
    
                                    }).catch((err: any) => {
                                        res.json({ "error": err, "errorvalue": true });
                                    });
    
                                }).catch((err: any) => {
                                    res.json({ "error": err, "errorvalue": true });
                                });
                            */


                        }).catch((err: any) => {
                            res.json({ "error": err, "errorvalue": true });
                        });

                    }).catch((err: any) => {
                        console.log(err);
                        res.json({ "error": err, "errorvalue": true });
                    });


                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }

            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });

        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }

    }

    async updatePaymentId(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    var updated_data_id = { "_reciptId": body.orderId };
                    var updated_data = {
                        $set: {
                            "is_active": 1,
                            "paymentId": body.paymentId
                        }
                    };
                    UsersCoin.update(updated_data_id, updated_data).then(result => {
                        var dta: any = result;

                        if (dta.result.nModified == 1) {

                            const id = { "_reciptId": body.orderId };
                            UsersCoin.find(id).then(result => {
                                var dt: any = result;

                                const id = { _id: new ObjectId(dt._userId) };
                                User.find(id).then(result => {
                                    var dtx: any = result;

                                    var coinsremain = dt.coins + dtx.usercoins;


                                    var updated_data_id = { _id: new ObjectId(dt._userId) };
                                    var updated_data = {
                                        $set: { "usercoins": coinsremain }
                                    };
                                    User.update(updated_data_id, updated_data).then(() => {
                                        res.json({ "data": { "remainingcoins": coinsremain, "paymentStatus": dta.result, "orderId": body.orderId, "paymentId": body.paymentId }, "errorvalue": false });
                                    }).catch((err: any) => {
                                        console.log(err);
                                        res.json({ "error": err, "errorvalue": true });
                                    });

                                }).catch((err: any) => {
                                    console.log(err);
                                    res.json({ "error": err, "errorvalue": true });
                                });


                            }).catch((err: any) => {
                                res.json({ "error": err, "errorvalue": true });
                            });

                        } else {
                            res.json({ "error": AlertString.CoinAlreadyAdded, "errorvalue": true });
                        }


                    }).catch((err: any) => {
                        console.log(err);
                        res.json({ "error": err, "errorvalue": true });
                    });


                } else {
                    res.json({ "error": AlertString.JWTissue, "errorvalue": true });
                }
            }).catch((err: any) => {
                res.json({ "error": err, "errorvalue": true });
            });

        } else {
            res.json({ "error": AlertString.authdont, "errorvalue": true });
        }

    }

    async userCoinsRepayMoney(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (body.redeemcoins < 50) {

                    res.status(200).send({
                        "error": "Redeem coin must be more then 50 Rupees",
                        "errorvalue": true
                    });

                } else {
                    if (data.superSecret == Config.superSecret) {

                        var updated_data_id = { _id: new ObjectId(data.id) };

                        User.find(updated_data_id).then(result => {
                            var dt: any = result;

                            // check for the account sufficiency
                            if (dt.usercoins < body.redeemcoins) {

                                res.status(200).send({
                                    "error": AlertString.moneyFailure,
                                    "errorvalue": true
                                });

                            } else {

                                // check for atleast balance of 50
                                // if ((dt.usercoins - body.redeemcoins) < 49) {

                                //     res.status(200).send({
                                //         "error": "You can't Redeem Coins. because your account would be empty.",
                                //         "errorvalue": true
                                //     });

                                // } else {

                                    let setbody: any = {};
                                    setbody.redeemcoins = body.redeemcoins;
                                    setbody.paynumber = body.paynumber;
                                    setbody.is_active = 0;

                                    setbody.phone = data.phone;

                                    setbody.created_on = new Date(Date());
                                    setbody._userId = new ObjectId(data.id);
                                    RedeemCoin.create(setbody).then(() => {
                                        // res.json({ "data": result, "errorvalue": false });

                                        var updated_id = { _id: new ObjectId(data.id) };
                                        var coinsafter = dt.usercoins - body.redeemcoins;
                                        var updated_data = {
                                            $set: { "usercoins": coinsafter, "updated_on": new Date(Date()) }
                                        };
                                        User.update(updated_id, updated_data).then((reus: any) => {
                                            var dtreus: any = reus;
                                            if (dtreus.result.n == 1 && dtreus.result.nModified == 1 && dtreus.result.ok == 1) {
                                                res.status(200).send({
                                                    "data": { "status": "success" },
                                                    "errorvalue": false
                                                });
                                            } else {
                                                res.status(401).send({
                                                    "error": "Data not modified in the Database.",
                                                    "errorvalue": true
                                                });
                                            }


                                        }).catch((err: any) => {
                                            console.log(err);
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
                                // }
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
                }

            }).catch((err: any) => {
                res.status(200).send({
                    "error": err,
                    "errorvalue": true
                });
            });

        } else {
            res.status(200).send({
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }

    async updateCoinsRepayMoney(req: Request, res: Response) {

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
                    RedeemCoin.update(updated_data_id, updated_data).then(result => {
                        var data: any = result;


                        if (data.result.nModified == 1) {

                            res.status(200).send({
                                "data": "Payment has been Updated. Money transfered to User",
                                "errorvalue": false
                            });
                        }

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
    }

    async getRoomCoinList(req: Request, res: Response) {
        let header = req.headers;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    RoomCoin.findAll().then(result => {

                        res.status(200).send({
                            "data": result,
                            "errorvalue": false
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
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }


    async getRedeemList(req: Request, res: Response) {
        let header = req.headers;
        var dta: any = JSON.parse(req.params.data);
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    var criteria: any = dta;
                    RedeemCoin.findSearchedAll(criteria).then(result => {
                        res.status(200).send({
                            "data": result,
                            "errorvalue": false
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
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }
    async getRedeemdata(req: Request, res: Response) {
        let header = req.headers;
     
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    
                    var criteria = data.phone;
                    RedeemCoin.findAll(criteria).then(result => {
                        var data:any = result; 
                        res.status(200).send({
                            "data": data,
                            "errorvalue": false
                        });
                    }).catch((err: any) => {
                        res.status(401).send({
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
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }
    async getUserTransaction(req: Request, res: Response) {
        let header = req.headers;
     
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    Roomdetails.findAllDetailsById(data.id).then((result:any)=>{
                        res.status(200).send({
                            "data": result,
                            "errorvalue": false
                        });
                    }).catch((err: any) => {
                        res.status(401).send({
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
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }
    async updateRedeem(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    var updated_id = { _id: new ObjectId(body._id) };
                    var updated_data: any;
                    if (body.reason) {
                        updated_data = {
                            $set: { "is_active": body.is_active, "name_of_payer": body.name_of_payer, "paytm_ref_id": "", "reason": body.reason, "updated_on": new Date(Date()) }
                        };
                    } else {
                        updated_data = {
                            $set: { "is_active": body.is_active, "name_of_payer": body.name_of_payer, "reason": "", "paytm_ref_id": body.paytm_ref_id, "updated_on": new Date(Date()) }
                        };
                    }
                    RedeemCoin.update(updated_id, updated_data).then((reus: any) => {
                        res.status(200).send({
                            "data": reus,
                            "errorvalue": false
                        });

                    }).catch((err: any) => {
                        console.log(err);
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
                "error": AlertString.authdont,
                "errorvalue": true
            });
        }

    }

    async putRoomCoinList(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;

        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    var setbody: any = {}
                    // DONE Additional Field while Creating Coins       
                    setbody.coins = body.entrycoins;
                    setbody.players = body.players;
                    setbody.is_active = 1;
                    RoomCoin.create(setbody).then(result => {
                        res.json({ "data": result, "errorvalue": false });
                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                } else {
                    res.status(403).send({
                        "error": AlertString.JWTissue,
                        "errorvalue": true
                    });
                }
            }).catch((err: any) => {
                res.status(403).send({
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

    }

    async deleteRoomCoinList(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const updated_data_id = { _id: new ObjectId(body._id) };
                    const updated_data = {
                        $set: { "is_active": 0 }
                    };
                    RoomCoin.update(updated_data_id, updated_data).then(result => {
                        var deletenotify: any = result;
                        if (deletenotify.modifiedCount == 1) {
                            res.json({ "data": { "result": AlertString.deleteSuccess }, "errorvalue": false });
                        } else {
                            res.json({ "data": { "result": AlertString.deleteFailure }, "errorvalue": false });
                        }

                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                } else {
                    res.status(403).send({
                        "error": AlertString.JWTissue,
                        "errorvalue": true
                    });
                }
            }).catch((err: any) => {
                res.status(403).send({
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

    }

    async deleteCoinList(req: Request, res: Response) {
        let header = req.headers;
        let body = req.body;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {

                    const updated_data_id = { _id: new ObjectId(body._id) };
                    const updated_data = {
                        $set: { "is_active": 0 }
                    };
                    Coin.update(updated_data_id, updated_data).then(result => {
                        var deletenotify: any = result;
                        if (deletenotify.modifiedCount == 1) {
                            res.json({ "data": { "result": AlertString.deleteSuccess }, "errorvalue": false });
                        } else {
                            res.json({ "data": { "result": AlertString.deleteFailure }, "errorvalue": false });
                        }

                    }).catch((err: any) => {
                        res.status(403).send({
                            "error": err,
                            "errorvalue": true
                        });
                    });
                } else {
                    res.status(403).send({
                        "error": AlertString.JWTissue,
                        "errorvalue": true
                    });
                }
            }).catch((err: any) => {
                res.status(403).send({
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

    }

}


export default new CoinController();