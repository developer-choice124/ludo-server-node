import express from "express";

import UserCtrl from "../Controllers";
import CoinController from "../Controllers/Coin.controller";
import PaytmController from "../Controllers/Paytm/Paytm.Controller";
import DashboardController from "../Controllers/Dashboard.controller";
import RoomDetailController from "../Controllers/RoomDetail.controller";
import ShareRedeemCoinController from "../Controllers/ShareRedeemCoin.controller";
import UpdateAppController from "../Controllers/UpdateAppController";
import FeedbackUserController from "../Controllers/FeedbackUserController";

export function routes() {
    const router = express.Router();


    router.post('/register', UserCtrl.register);
    router.post('/login-web', UserCtrl.login);
    router.post('/forgetpassword-web', UserCtrl.forgetPassword);
    router.post('/resetpassword-web', UserCtrl.resetPassword);
    
    router.post('/verify-user', UserCtrl.verifyUser);
    router.post('/detail-user', UserCtrl.detailUser);
    router.post('/update-user-coins', UserCtrl.userCoinsUpdate);
    
    router.get('/get-user-detail', UserCtrl.getUserDetail);
    router.get('/get-users-list/:data', UserCtrl.getUserList);
    
    router.post('/delete-buy-coin', CoinController.deleteCoinList);
    router.post('/post-buy-coin-list', CoinController.putCoinList);

    /*new code*/

    router.get('/get-buy-coin-list', CoinController.getCoinList);    
    router.get('/get-users-bought-coins-list/:data', PaytmController.getBoughtCoinsList);
    
    router.get('/get-room-coin-list', CoinController.getRoomCoinList);
    router.post('/post-room-coin-list', CoinController.putRoomCoinList);
    router.post('/delete-room-coin', CoinController.deleteRoomCoinList);
    
    router.post('/buy-coins', CoinController.buyCoins);
    router.get('/room-details/:data', RoomDetailController.getRoomDetails);

    router.post('/post-room-entered-coin-charges', CoinController.chargePerRoomCoins);
    router.post('/post-winner-coins', CoinController.winnerCoinsUpdate);

    router.post('/post-update-payment-id', CoinController.updatePaymentId);
    router.post('/post-repay-payment-amount', CoinController.userCoinsRepayMoney);
    router.post('/post-repay-payment-amount-update', CoinController.updateCoinsRepayMoney);
    router.get('/get-repay-payment-amount-list/:data', CoinController.getRedeemList);
    router.get('/get-repay-payment-amount-list-by-jwt', CoinController.getRedeemdata);
    router.get('/get-transaction-list-by-user', CoinController.getUserTransaction);
    
    router.post('/update-repay-payment-amount-list', CoinController.updateRedeem);    
    router.post('/share-repay-by-coin-request', ShareRedeemCoinController.createShareRedeem);
    router.post('/check-refeered-already-by-user', ShareRedeemCoinController.checkShareRedeem);
    router.post('/share-repay-by-coin-request-update', ShareRedeemCoinController.updateShareRedeem);
    router.get('/share-repay-by-coin-request-list/:data',  ShareRedeemCoinController.getShareRedeemlist);
    
    router.get('/make-payment/:orderId', PaytmController.makePayment);
    router.get('/payment-link/:data', PaytmController.linkPayment);
    router.get('/get-room-list', DashboardController.getRoomList);
    
    router.post('/post-app-update-list', UpdateAppController.addNewUpdateList);
    router.get('/get-app-update-data', UpdateAppController.getNewUpdateData);
    router.get('/get-app-update-list/:data', UpdateAppController.getNewUpdateList);


    router.post('/feedback-user', FeedbackUserController.addFeedbackUser);
    router.get('/get-feedback-user/:data', FeedbackUserController.getFeedbackUser);

    return router;
}