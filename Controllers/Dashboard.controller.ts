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
export class DashboardController {
    constructor() {
        this.getRoomList = this.getRoomList.bind(this);
    }
    async getRoomList(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {


                        res.json({ "data": data, "errorvalue": false });


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


export default new DashboardController();