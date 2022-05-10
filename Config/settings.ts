import fs from "fs";
var privateKEY  = fs.readFileSync('./Config/private.key', 'utf8');
var publicKEY  = fs.readFileSync('./Config/public.key', 'utf8');

// PRIVATE and PUBLIC key
var i  = 'Techphant';          // Issuer
var s  = 'contact@techphant.com';        // Subject
var a  = 'http://tsngaming.online'; // Audience

// var IPvalue = 'http://192.168.1.15';
var IPvalue = 'http://tsngaming.online';
var port = '8000';

// SIGNING OPTIONS
var signOptions = {
    issuer:  i,
    subject:  s,
    audience:  a,
    expiresIn:  "1y",
    algorithm:  "RS256"
};

var verifyOptions = {
    issuer:  i,
    subject:  s,
    audience:  a,
    expiresIn:  "1y",
    algorithm:  "RS256"
};
const conf = {
    mongoUrl : "mongodb://localhost:27017",
    database : 'LudoDB',
    privateKEY : privateKEY,
    publicKEY : publicKEY,
    signOptions : signOptions,
    verifyOptions : verifyOptions,
    superSecret : "LudoTechphantAppSecret",
    // superSecret : "",
    key_id: 'rzp_test_iBzEFgwKNnTHxh',
    key_secret: 'LFkjdwhClMEYPdd3tB9yJZRu',
    baseUrl : IPvalue + ":"+ port +"/",
    _port : port,
    _IPvalue : IPvalue,

    apiV : 'api/v1/',
    //Clickatell Config
    SMSAPIKEY : "/YOUR-APIKEY/",
    SMSTEXT : "Your Pocket Ludo King Game OTP(one time password) - ",
    SMSPASSTEXT : "Your Pocket Ludo King Game OTP(one time password) for ADMIN is - ",
    SMSNEWPASSTEXT : "Your Pocket Ludo King Game NEW Password for ADMIN is - ",

    //AWS KEYS
    AWSAccessKeyId : "/AWS-AKEYID/",
    AWSSecretKey:"/AWS-SKEY/",
    AWS_S3_BUCKET_NAME:"ludogameserver",
    AWS_S3_BUCKET_SubFolder_Name:"passbookimages",
    AWS_S3_BUCKET_SubFolder_Name_banner:"bannerimages"
}


 // PAYLOAD
export default conf;