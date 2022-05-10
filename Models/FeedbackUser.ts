import { Model } from "./Model";
import assert from "assert";

class FeedbackUser extends Model {

    private collection = 'feedbackUser';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.update = this.update.bind(this);
        this.find = this.find.bind(this);
        this.findLatest = this.findLatest.bind(this);
        this.findSearchedAll = this.findSearchedAll.bind(this);
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
    findLatest(){
        return new Promise((resolve, reject) => {
            let coins = this.db.collection(this.collection);
            coins.findOne({}, { sort: { created_on: -1 } }, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }
   
    findAll(criteria:number) {
        return new Promise((resolve, reject) => {
            var resultArray: any = [];
            let updateapp = this.db.collection(this.collection).find();
            updateapp.each(function (err: any, res: any) {
                if (err) {
                    reject(err);
                }
                if (res && res.is_active == criteria) {
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

export default new FeedbackUser();