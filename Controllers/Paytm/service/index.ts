import { config } from "../config";
import * as checksum from "../lib/checksum";

// export const initPayment = function (amount: any, orderId:any, userId:any) {
export const initPayment = function (dta: any) {
    return new Promise((resolve, reject) => {
        // console.log(shortid.generate());

        
        let id = dta._id.toString();
        let userid = dta._userId.toString();
        let paymentObj: any = {
            // ORDER_ID: shortid.generate(),
            // CUST_ID: shortid.generate(),
            ORDER_ID: id,
            CUST_ID: userid,
            INDUSTRY_TYPE_ID: config.INDUSTRY_TYPE_ID,
            CHANNEL_ID: config.CHANNEL_ID,
            TXN_AMOUNT: dta.price.toString(),
            MID: config.MID,
            WEBSITE: config.WEBSITE,
            CALLBACK_URL: config.CALLBACK_URL
        };

        checksum.genchecksum(
            paymentObj,
            config.PAYTM_MERCHANT_KEY,
            (err, result) => {
                if (err) {
                    return reject('Error while generating checksum');
                } else {
                    paymentObj['CHECKSUMHASH'] = result;
                    return resolve(paymentObj);
                }
            }
        );
    });
};

export const responsePayment = function (paymentObject: any) {
    return new Promise((resolve, reject) => {
        if (
            checksum.verifychecksum(
                paymentObject,
                config.PAYTM_MERCHANT_KEY,
                paymentObject.CHECKSUMHASH
            )
        ) {
            resolve(paymentObject);
        } else {
            return reject('Error while verifying checksum');
        }
    });
};