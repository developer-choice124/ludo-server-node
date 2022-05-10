import Config from "../Config/settings";
import { MongoClient } from "mongodb";

let mongo_client:any;
let db:any;

export function dbConnect(){
    return new Promise((resolve, reject) => {
        if(db){
            resolve(db);
        }else{
            MongoClient.connect(Config.mongoUrl, {useUnifiedTopology: true}, function(err, client){
                if(err){
                    reject(err);
                }
                mongo_client = client;
                db = mongo_client.db(Config.database);
                // make sure connection closes the db
                process.on('exit', (code) => {
                    dbClose();
                });
                resolve(db);
            });
        }
    });
}

export function dbClose(){
    if(mongo_client && mongo_client.isConnected()){
        mongo_client.close();
    }
}