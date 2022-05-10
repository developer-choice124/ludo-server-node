

import Config from "../../Config/settings";
export const config_test = {
    MID: process.env.MID = "ezSeCn88818303659539",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "P6@fZ2SASYWGSRet",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "WEBSTAGING",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "api/v1/payment-status"
}
export const config = {
    MID: process.env.MID = "BAlCyS63031067789417",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "9plHzyc@V4YN&TQZ",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw-stage.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "WEBSTAGING",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "paywithpaytmresponse"
}