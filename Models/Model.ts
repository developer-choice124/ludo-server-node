import { dbConnect } from "../Utils";
import mongodb, { ObjectId } from "mongodb";

export class Model {

    public db: any;

    constructor() {
        this.connect();
    }

    connect() {
        dbConnect().then((database: any) => {
            this.db = database;
        }).catch((err: any) => {
            this.db = null;
        })
    }

}