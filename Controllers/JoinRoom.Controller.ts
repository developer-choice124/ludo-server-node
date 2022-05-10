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
import JoinRoomList from "../Models/JoinRoomList";
export class JoinRoomController {
    constructor() {
        this.addCreatedRoom = this.addCreatedRoom.bind(this);
        this.getJoinRoomData = this.getJoinRoomData.bind(this);
        // this.getNewAboutList = this.getNewAboutList.bind(this);
        
    }
    async addCreatedRoom(req: Request, res: Response) {

        let headers = req.headers;
        let body = req.body;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                        
                        const min = 1000;
                        const max = 9999;

                        const temp = Math.floor(Math.random() * (max - min + 1) + min);
                        var random = "WPL" + temp;

                        const joinroom = { "createdroomid": random };
                        
                        // res.json({  "pass": this.AESencode(Config.superSecret,body.password) });
                        JoinRoomList.find(joinroom).then(result => {
                            var dt: any = result;

                            if(dt){

                                const updated_data_id = { "createdroomid": dt.createdroomid };
                                const updated_data = {
                                    $set: { "joinroomdata": body.joinroomdata, "created_on": new Date(Date()) }
                                };

                                JoinRoomList.update(updated_data_id, updated_data).then(result => {
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
                                
                                var setbody: any = {}
                                setbody.createdroomid = random;
                                setbody.joinroomdata = body.joinroomdata;
                                setbody.created_on = new Date(Date());

                                JoinRoomList.create(setbody).then(result => {
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
                                
                            }                          
                            

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

    async getJoinRoomData(req: Request, res: Response) {

        let headers = req.headers;
        var dta: any = req.query.id;
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                        // res.status(200).send({
                        //     "data": ,
                        //     "errorvalue": false
                        // });
                        
                        const data_id = { "createdroomid": dta };
                        console.log(data_id);
                            JoinRoomList.findLatest(data_id).then(result => {
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
    // async getNewAboutList(req: Request, res: Response) {
    //     let headers = req.headers;
    //     var dta: any = JSON.parse(req.params.data);
    //     if (headers.apisecret == Config.superSecret) {
    //         if (headers.authorization) {
    //             var jwt = headers.authorization.split(" ");
    //             User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
    //                 var data: any = result;
    //                 if (data.superSecret == Config.superSecret) {

    //                         AboutList.findAll(dta.is_active).then(result => {
    //                             var dtx: any = result;
    //                             res.status(200).send({
    //                                 "data": dtx,
    //                                 "errorvalue": false
    //                             });
    //                         }).catch((err: any) => {
    //                             res.status(403).send({
    //                                 "error": err,
    //                                 "errorvalue": true
    //                             });
    //                         });

    //                 } else {
    //                     res.status(401).send({
    //                         "error": AlertString.JWTissue,
    //                         "errorvalue": true
    //                     });
    //                 }
    //             }).catch((err: any) => {
    //                 res.status(401).send({
    //                     "error": err,
    //                     "errorvalue": true
    //                 });
    //             });

    //         } else {
    //             res.status(403).send({
    //                 "error": AlertString.adminHeaderInvalid,
    //                 "errorvalue": true
    //             });
    //         }
    //     } else {
    //         res.status(403).send({
    //             "error": AlertString.adminHeaderInvalid,
    //             "errorvalue": true
    //         });
    //     }
    // }

}


export default new JoinRoomController();