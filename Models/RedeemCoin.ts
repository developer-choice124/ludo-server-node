import { Model } from "./Model";
import assert from "assert";

class RedeemCoin extends Model {

    private collection = 'redeemcoins';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.find = this.find.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findSearchedAll = this.findSearchedAll.bind(this);
    }

    create(data: object) {
        return new Promise((resolve, reject) => {
            let coins = this.db.collection(this.collection);
            coins.insertOne(data, (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(res.ops);
            })
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
    
    find(data: any){
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

    findAll(criteria:any) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let coins = this.db.collection(this.collection).find({ phone: { $eq: criteria } });
            coins.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res && res.is_active == 0) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }
    findSearchedAll(criteria:any) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find({  
                $and: [ { 
                    $where : "this.is_active == " + criteria.is_active }, 
                    {
                    "created_on": {
                        "$gte": new Date(criteria.first_date), 
                        "$lt": new Date(criteria.last_date)
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

}

export default new RedeemCoin();