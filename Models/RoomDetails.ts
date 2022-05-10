import { Model } from "./Model";

class Roomdetails extends Model {

    private collection = 'roomdetails';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.find = this.find.bind(this);
        this.findAllConditionalCheck = this.findAllConditionalCheck.bind(this);
        this.findAllConditionalCheckNull = this.findAllConditionalCheckNull.bind(this);
    }

    create(data: object) {
        return new Promise((resolve, reject) => {
            let coins = this.db.collection(this.collection);
            coins.insertOne(data, (err: any, res: any) => {
                if (err) {
                    reject(err);
                }
                resolve(res.ops);
            })
        });
    }

    find(data: any) {
        return new Promise((resolve, reject) => {
            let users = this.db.collection(this.collection);
            users.findOne(data, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    findAll() {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find();
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }

    findAllDetailsById(UserId:any){
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users:any;
            users = this.db.collection(this.collection).find({ "players.varifyId": UserId });                      
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                } else if (res) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }

    findAllConditionalCheck(dta: any,skiped :number) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users:any;
            users = this.db.collection(this.collection).find({  
                $and: [ { 
                    $where : "this.max_players == " + dta.max_players }, 
                    { winnerId: { $exists: dta.winner_must },
                    "date_modified": {
                        "$gte": new Date(dta.first_date), 
                        "$lt": new Date(dta.last_date)
                    } 
                } ]
            }).skip(skiped);
            // }).skip(100).limit(100);                      
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                } else if (res) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }
    findAllConditionalCheckNull(dta: any) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users:any;
            users = this.db.collection(this.collection).find({  
                $and: [ { 
                    $where : "this.max_players == " + dta.max_players }, 
                    {
                    "date_modified": {
                        "$gte": new Date(dta.first_date), 
                        "$lt": new Date(dta.last_date)
                    } 
                } ]
            });                      
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                } else if (res) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }

    update(data_id: any, updated_data_id: any) {
        return new Promise((resolve, reject) => {
            let users = this.db.collection(this.collection);
            users.updateOne(data_id, updated_data_id, function (err: any, count: any) {
                if (err) {
                    reject(err);
                }
                resolve(count);
            });
        });
    }

}

export default new Roomdetails();