

import Config from "../../Config/settings";
export const config_prod = {
    MID: process.env.MID = "IufIGD96195585347121",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "#dfxlZr4QtFSuQSB",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "DEFAULT",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "paywithpaytmresponse",

}


export const config_test  = {
    MID: process.env.MID = "lwzUHy00743627703110",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "0COmnW0rtgGu9zI6",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw-stage.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "WEBSTAGING",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "paywithpaytmresponse"
}


export const config = {
    MID: process.env.MID = "lwzUHy00743627703110",
    PAYTM_MERCHANT_KEY: process.env.PAYTM_MERCHANT_KEY = "0COmnW0rtgGu9zI6",
    PAYTM_FINAL_URL: process.env.PAYTM_FINAL_URL = "https://securegw-stage.paytm.in/theia/processTransaction",
    WEBSITE: process.env.WEBSITE = "WEBSTAGING",
    CHANNEL_ID: process.env.CHANNEL_ID = "WEB",
    INDUSTRY_TYPE_ID: process.env.INDUSTRY_TYPE_ID = "Retail",
    CALLBACK_URL: process.env.CALLBACK_URL = Config.baseUrl + "paywithpaytmresponse"
}

