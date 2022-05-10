import { Model } from "./Model";
import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";

class AdminUser extends Model {

    private collection = 'admindetails';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.check = this.check.bind(this);
        this.update = this.update.bind(this);
        this.find = this.find.bind(this);
        this.findById = this.findById.bind(this);
    }

    create(data: object) {
        return new Promise((resolve, reject) => {
            let users = this.db.collection(this.collection);
            users.insertOne(data, (err: any, res: any) => {
                if (err) {
                    reject(
                        err);
                }
                resolve(res.ops);
            })
        });
    }

    check(checked_data: any) {
        return new Promise((resolve, reject) => {
            let users = this.db.collection(this.collection);
            users.countDocuments(checked_data, function (err: any, count: any) {
                if (err) {
                    reject(err);
                }
                resolve(count);
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

    findById(_id: any){
        return new Promise((resolve, reject) => {
            
            let users = this.db.collection(this.collection);
            users.find({"_id": new ObjectId(_id) }, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }                
                resolve(res);
            });
        });
    }
    

}

export default new AdminUser();