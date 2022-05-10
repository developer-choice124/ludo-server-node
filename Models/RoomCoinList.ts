import { Model } from "./Model";
import assert from "assert";

class RoomCoin extends Model {

    private collection = 'roomcoins';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.find = this.find.bind(this);
        this.delete = this.delete.bind(this);
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
    delete(data:any){
        console.log(data);
        return new Promise((resolve, reject) => {

            let coins = this.db.collection(this.collection);
            coins.deleteOne(data, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }

    find(data: any) {
        return new Promise((resolve, reject) => {
            let coins = this.db.collection(this.collection);
            coins.findOne(data, function (err: any, res: any) {
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
            let coins = this.db.collection(this.collection).find();
            coins.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res && res.is_active == 1) {
                    resultArray.push(res);
                }
                resolve(resultArray);
            });
        });
    }

    findAllAsc() {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find().sort( { coins: 1 } );
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

export default new RoomCoin();