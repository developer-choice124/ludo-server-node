import { Model } from "./Model";
import assert from "assert";

class Userscoin extends Model {

    private collection = 'userscoin';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.find = this.find.bind(this);
        this.findSearchedAll = this.findSearchedAll.bind(this);
        this.findAllbyID = this.findAllbyID.bind(this);
        this.findAll = this.findAll.bind(this);
        
        // this.findAll = this.findAll.bind(this);
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
    
    findSearchedAll(criteria:any,skiped:number) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find({  
                $and: [ { 
                    $where : "this.is_active == " + criteria.is_active }, 
                    {
                    "updated_on": {
                        "$gte": new Date(criteria.first_date), 
                        "$lt": new Date(criteria.last_date)
                    } 
                } ]
            }).skip(skiped);                      
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
    findAllbyID(criteria:any,skiped:number) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let users = this.db.collection(this.collection).find({  
                $and: [ { 
                    $where : "this.phone == " + criteria.phone }, 
                    {
                    "updated_on": {
                        // "$gte": new Date(criteria.first_date), 
                        "$lt": new Date(criteria.last_date)
                    },
                    
                } ]
            },{ sort: { updated_on: -1 } }).skip(skiped);               
            users.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                } else if (res) {
                    // console.log(res);       
                    resultArray.push(res);
                }
                // console.log(resultArray);
                resolve(resultArray);
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

}

export default new Userscoin();