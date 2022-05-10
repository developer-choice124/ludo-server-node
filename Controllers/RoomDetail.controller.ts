import { Request, Response, NextFunction } from "express";
import Config from "../Config/settings";
import AlertString from "../Config/alertstring";
import User from "../Models/User";
import RoomDetails from "../Models/RoomDetails";
export class RoomDetailController {
    constructor() {
        this.getRoomDetails = this.getRoomDetails.bind(this);
    }
    getRoomDetails(req: Request, res: Response) {

        let headers = req.headers;
        var dta: any = JSON.parse(req.params.data);
        var realdata:any = [];
        var skiper = 0;
        console.log("*******************/////////START///////////**********************");
        if (headers.apisecret == Config.superSecret) {
            if (headers.authorization) {
                var jwt = headers.authorization.split(" ");
                User.jwtAuth(jwt[1], Config.publicKEY, Config.verifyOptions).then(result => {
                    var data: any = result;
                    if (data.superSecret == Config.superSecret) {

                        if (dta.max_players == 2) {
                            var skipped = 0;
                            function getDetails(dta:any,skip:number) {
                                RoomDetails.findAllConditionalCheck(dta,skip).then((result: any) => {
                                    var data: any = result;
                                    if (data.length>=100) {
                                        
                                        skipped = skip + 100;
                                         realdata = realdata.concat(data);
                                        if(realdata){
                                            getDetails(dta,skipped);
                                        }

                                    } else {
                                        realdata = realdata.concat(data);
                                            res.status(200).send({
                                                "data": realdata,
                                                "errorvalue": false
                                            });
                                        
                                    }

                                }).catch((err: any) => {
                                    res.status(403).send({
                                        "error": err,
                                        "errorvalue": true
                                    });
                                });
                            }
                            switch (dta.winner_must) {
                                
                                case true:               
                                    getDetails(dta,skiper);
                                    break;           
                                case false:
                                    getDetails(dta,skiper);
                                    break;                  

                                case null:

                                    RoomDetails.findAllConditionalCheckNull(dta).then((result: any) => {
                                        var data: any = result;
                                        if (data) {
                                            res.status(200).send({
                                                "data": data,
                                                "errorvalue": false
                                            });
                                        }

                                    }).catch((err: any) => {
                                        res.status(403).send({
                                            "error": err,
                                            "errorvalue": true
                                        });
                                    });
                                    break;
                            }
                        } else if (dta.max_players == 4) {
                            
                            var skipped = 0;
                            function getDetails(dta:any,skip:number) {
                                RoomDetails.findAllConditionalCheck(dta,skip).then((result: any) => {
                                    var data: any = result;
                                    if (data.length>=100) {
                                        
                                        skipped = skip + 100;
                                         realdata = realdata.concat(data);
                                        if(realdata){
                                            getDetails(dta,skipped);
                                        }

                                    } else {
                                        realdata = realdata.concat(data);
                                            res.status(200).send({
                                                "data": realdata,
                                                "errorvalue": false
                                            });
                                        
                                    }

                                }).catch((err: any) => {
                                    res.status(403).send({
                                        "error": err,
                                        "errorvalue": true
                                    });
                                });
                            }
                            switch (dta.winner_must) {
                                case true:                                    
                                    getDetails(dta,skiper);
                                    break;
                                case false:
                                    getDetails(dta,skiper);
                                    break;
                                case null:

                                    RoomDetails.findAllConditionalCheckNull(dta).then((result: any) => {
                                        var data: any = result;
                                        if (data) {
                                            res.status(200).send({
                                                "data": data,
                                                "errorvalue": false
                                            });
                                        }

                                    }).catch((err: any) => {
                                        res.status(403).send({
                                            "error": err,
                                            "errorvalue": true
                                        });
                                    });
                                    break;
                            }
                        } else if (dta.max_players == 3) {
                            var skipped = 0;
                            function getDetails(dta:any,skip:number) {
                                RoomDetails.findAllConditionalCheck(dta,skip).then((result: any) => {
                                    var data: any = result;
                                    if (data.length>=100) {
                                        
                                        skipped = skip + 100;
                                         realdata = realdata.concat(data);
                                        if(realdata){
                                            getDetails(dta,skipped);
                                        }

                                    } else {
                                        realdata = realdata.concat(data);
                                            res.status(200).send({
                                                "data": realdata,
                                                "errorvalue": false
                                            });
                                        
                                    }

                                }).catch((err: any) => {
                                    res.status(403).send({
                                        "error": err,
                                        "errorvalue": true
                                    });
                                });
                            }
                            switch (dta.winner_must) {
                                case true:                                    
                                    getDetails(dta,skiper);
                                    break;
                                case false:
                                    getDetails(dta,skiper);
                                    break;
                                case null:

                                    RoomDetails.findAllConditionalCheckNull(dta).then((result: any) => {
                                        var data: any = result;
                                        if (data) {
                                            res.status(200).send({
                                                "data": data,
                                                "errorvalue": false
                                            });
                                        }

                                    }).catch((err: any) => {
                                        res.status(403).send({
                                            "error": err,
                                            "errorvalue": true
                                        });
                                    });
                                    break;
                            }
                        }
                        // RoomDetails.findAllConditional(dta).then((result: any) => {
                        //     var data: any = result;
                        //     if (data) {
                        //         res.status(200).send({
                        //             "data": data,
                        //             "errorvalue": false
                        //         });
                        //     }

                        // }).catch((err: any) => {
                        //     res.status(403).send({
                        //         "error": err,
                        //         "errorvalue": true
                        //     });
                        // });


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
                "error": AlertString.adminHeaderInvalidSUPER,
                "errorvalue": true
            });
        }
    }


}


export default new RoomDetailController();