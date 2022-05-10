import * as crypto from "crypto";
import * as util from "util";

export const crypt = {
    iv: '@@@@&&&&####$$$$',
    encrypt: function (data: string, custom_key: any) {
        var iv = this.iv;
        var key = custom_key;
        var algo = '256';
        switch (key.length) {
            case 16:
                algo = '128';
                break;
            case 24:
                algo = '192';
                break;
            case 32:
                algo = '256';
                break;
        }
        var cipher = crypto.createCipheriv('AES-' + algo + '-CBC', key, iv);
        //var cipher = crypto.createCipher('aes256',key);
        var encrypted = cipher.update(data, 'binary', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    },

    decrypt: function (data: any, custom_key: any) {
        var iv = this.iv;
        var key = custom_key;
        var algo = '256';
        switch (key.length) {
            case 16:
                algo = '128';
                break;
            case 24:
                algo = '192';
                break;
            case 32:
                algo = '256';
                break;
        }
        var decipher = crypto.createDecipheriv('AES-' + algo + '-CBC', key, iv);
        var decrypted = decipher.update(data, 'base64', 'binary');
        try {
            decrypted += decipher.final('binary');
        } catch (e) {
            util.log(util.inspect(e));
        }
        return decrypted;
    },

    gen_salt: function (length: number, cb: (arg0: Error | null, arg1: string | undefined) => void) {
        crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
            var salt;
            if (!err) {
                salt = buf.toString("base64");
            }
            //salt=Math.floor(Math.random()*8999)+1000;
            cb(err, salt);
        });
    },

    /* one way md5 hash with salt */
    md5sum: function (salt: any, data: any) {
        return crypto.createHash('md5').update(salt + data).digest('hex');
    },
    sha256sum: function (salt: any, data: any) {
        return crypto.createHash('sha256').update(data + salt).digest('hex');
    }
}