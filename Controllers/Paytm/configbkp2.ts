

import Config from "../../Config/settings";
export const config = {
    MID: process.env.MID = "QQtiLW11141318185091",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "@pWxo!n4IZ&sJ&5q",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "DEFAULT",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "paywithpaytmresponse"
}
