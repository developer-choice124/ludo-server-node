import { Model } from "./Model";
import assert from "assert";

class Coin extends Model {

    private collection = 'coins';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.findAllAsc = this.findAllAsc.bind(this);
        this.create = this.create.bind(this);
        this.find = this.find.bind(this);
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
                if (res && res.is_active == 1) {
                    resultArray.push(res);
                }
                // console.log(resultArray);
                resolve(resultArray);
            });
        });
    }
    
    findAllAsc() {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find().sort( { price: 1 } );
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res && res.is_active == 1) {
                    resultArray.push(res);
                }
                // console.log(resultArray);
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

export default new Coin();