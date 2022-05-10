import { Model } from "./Model";
import assert from "assert";

class UpdateAppList extends Model {

    private collection = 'updateapp';

    constructor() {
        super();
        this.create = this.create.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
        this.find = this.find.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
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
    

}

export default new UpdateAppList();