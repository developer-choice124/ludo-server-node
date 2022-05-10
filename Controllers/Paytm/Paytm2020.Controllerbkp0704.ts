import { Request, Response, NextFunction } from "express";
import { initPayment, responsePayment } from "./service/index";
import * as ejs from "ejs";
import stringify from "json-stringify-safe";
import Config from "../../Config/settings";
import UsersCoin from "../../Models/UsersCoin";
import { ObjectId } from "mongodb";
import User from "../../Models/User";
export class PaytmController {



    constructor() {
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

}

export default new PaytmController();