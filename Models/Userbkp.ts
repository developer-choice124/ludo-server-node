import { Model } from "./Model";
import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";

class User extends Model {

    private collection = 'users';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.check = this.check.bind(this);
        this.update = this.update.bind(this);
        this.find = this.find.bind(this);
        this.findById = this.findById.bind(this);
        this.findSearchedAll = this.findSearchedAll.bind(this);
        this.jwtCreate = this.jwtCreate.bind(this);
        this.jwtAuth = this.jwtAuth.bind(this);
    }

    create(data: object) {
        return new Promise((resolve, reject) => {
            let users = this.db.collection(this.collection);
            users.insertOne(data, (err: any, res: any) => {
                if (err) {
                    reject(err);
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
    // findSearchedAll(criteria:any) {
    //     return new Promise((resolve, reject) => {
    //         var resultArray: any = [];
    //         console.log(criteria);
    //         let users = this.db.collection(this.collection).find({  
    //             $and: [ { 
    //                 $where : "this.is_active == " + criteria.is_active }, 
    //                 {
    //                 "created_on": {
    //                     "$gte": new Date(criteria.first_date), 
    //                     "$lt": new Date(criteria.last_date)
    //                 } 
    //             } ]
    //         });                   
    //         users.each(function (err: any, res: any) {
    //             if (err) {
    //                 reject(err);
    //             } else if (res) {
    //                 resultArray.push(res);
    //             }
    //             resolve(resultArray);
    //         });
    //     });
    // }
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
    
    async jwtCreate(token:any, publicKEY:any, verifyOptions:any){
        return await new Promise((resolve, reject) => {
            jsonwebtoken.sign(token, publicKEY, verifyOptions, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }                
                resolve(res);
            });
        });
        
    }
    async jwtAuth(token:any, publicKEY:any, verifyOptions:any){
        return await new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, publicKEY, verifyOptions, function (err: any, res: any) {
                if (err) {
                    reject(err);
                }                
                resolve(res);
            });
        });
    }

    

}

export default new User();