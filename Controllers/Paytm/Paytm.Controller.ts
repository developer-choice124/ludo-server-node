import { Request, Response, NextFunction } from "express";
import { initPayment, responsePayment } from "./service/index";
import * as ejs from "ejs";
import AlertString from "../../Config/alertstring";
import stringify from "json-stringify-safe";
import Config from "../../Config/settings";
import UsersCoin from "../../Models/UsersCoin";
import { ObjectId } from "mongodb";
import User from "../../Models/User";
export class PaytmController {



    constructor() {
        this.makePayment = this.makePayment.bind(this);
        this.linkPayment = this.linkPayment.bind(this);
        this.getBoughtCoinsList = this.getBoughtCoinsList.bind(this);
        this.getBroughtCoinByUser = this.getBroughtCoinByUser.bind(this);
        
    }

    makePayment(req: Request, res: Response) {
        const id = { _id: new ObjectId(req.params.orderId) };
        UsersCoin.find(id).then((result: any) => {
            var dtx: any = result;
            var tts = Config.baseUrl + Config.apiV + 'payment-link/' + JSON.stringify(dtx);
            res.redirect(tts);
        }).catch((err: any) => {
            return err;
        });
    }

    linkPayment(req: Request, res: Response) {

        var dta = JSON.parse(req.params.data);
        if (dta.is_active == 0) {
            initPayment(dta).then(
                success => {
                    res.render("paytmRedirect.ejs", {
                        resultData: success,
                        paytmFinalUrl: process.env.PAYTM_FINAL_URL
                    });
                },
                err => {
                    res.json({ error: err })
                }
            )
        }
    }


    static paymentStatus(data: any, res: Response) {
            if (data.STATUS == "TXN_SUCCESS") {
                var updated_data_id = { _id: new ObjectId(data.ORDERID) };

                var updated_data = {
                    $set: {
                        "is_active": 1,
                        "status": data
                    }
                };
                UsersCoin.update(updated_data_id, updated_data).then(result => {

                    UsersCoin.find(updated_data_id).then(result => {
                        var dt : any = result; 
                        var userId = { _id: new ObjectId(dt._userId) };
                       
                        User.find(userId).then(resultx => {
                                var dta :any = resultx;

                                var updated_data_value = {
                                    $set: {
                                        "usercoins": dt.coins + dta.usercoins
                                    }
                                };
                            
                                var user_Id = { _id: new ObjectId(dta._id) };
                                User.update(user_Id, updated_data_value).then(resultval => {
                                    var setdta :any = resultval;
                                    if(setdta.result.nModified==1 && setdta.result.n==1){
                                        var tts2 = Config.baseUrl + Config.apiV + 'success.node';
                                        res.redirect(tts2);
                                    } else {
                                        var tts2 = Config.baseUrl + Config.apiV + 'failed.node';
                                        res.redirect(tts2);
                                    }
                                    // if(setdta.CommandResult.modifiedCount==1){
                                    // }

                                }).catch((err: any) => {
                                    res.json({ "error": err, "errorvalue": true });
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

            } else {
                var tts2 = Config.baseUrl + Config.apiV + 'failed.node';
                res.redirect(tts2);

            }
    }

    async getBoughtCoinsList(req: Request, res: Response) {
        let header = req.headers;
        var dta: any = JSON.parse(req.params.data);
        var realdata:any = [];
        var skiper = 0;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    var criteria: any = dta;

                    var skipped = 0;
                    function broughtCoin(criteria:any,skip:number){
                        
                        skipped = skip + 100;
                        UsersCoin.findSearchedAll(criteria,skip).then((data:any) => {
                            if (data.length>=100) {
                                        
                                skipped = skip + 100;
                                 realdata = realdata.concat(data);
                                if(realdata){
                                    broughtCoin(criteria,skipped);
                                }
                            } else {
                                realdata = realdata.concat(data);
                                res.status(200).send({
                                    "data": realdata,
                                    "errorvalue": false
                                });
                                
                            }
                        }).catch((err: any) => {
                            res.status(401).send({
                                "error": err,
                                "errorvalue": true
                            });
                        });
                    }

                    broughtCoin(criteria,skiper);

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
    
    async getBroughtCoinByUser(req: Request, res: Response) {
        let header = req.headers;
     
        var realdata:any = [];
        var skiper = 0;
        if (header.authorization) {
            var jwt = header.authorization.split(" ");
            await User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                var data: any = result;
                if (data.superSecret == Config.superSecret) {
                    // Roomdetails.findAllDetailsById(data.id).then((result:any)=>{
                    //     res.status(200).send({
                    //         "data": result,
                    //         "errorvalue": false
                    //     });
                    // }).catch((err: any) => {
                    //     res.status(401).send({
                    //         "error": err,
                    //         "errorvalue": true
                    //     });
                    // });
                    
                    var skipped = 0;
                    var criteria:any = {};
                    var today_date: Date = new Date();
                    criteria.first_date = new Date(today_date.getFullYear(), today_date.getMonth(), 1);;
                    criteria.last_date = new Date(Date());
                    criteria.last_date = new Date(Date());
                    criteria.phone = data.phone;
                    // res.status(200).send({
                    //     "error": criteria,
                    //     "errorvalue": true
                    // });
                    function broughtCoin(skip:number,criteria:any){
                        
                        UsersCoin.findAllbyID(criteria,skipped).then((data:any)=>{
                            if (data.length>=100) {
                                        
                                skipped = skip + 100;
                                 realdata = realdata.concat(data);
                                if(realdata){
                                    broughtCoin(skipped,criteria);
                                }
                            } else {
                                realdata = realdata.concat(data);
                                res.status(200).send({
                                    "data": realdata,
                                    "errorvalue": false
                                });
                                
                            }
                        }).catch((err: any) => {
                            res.status(401).send({
                                "error": err,
                                "error1": "err4",
                                "errorvalue": true
                            });
                        });

                    }
                    
                    broughtCoin(skiper,criteria);
                   
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

}

export default new PaytmController();