import { Room, Client } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import RoomDetails from "../Models/RoomDetails";
import { json } from "body-parser";
import { ObjectId } from "mongodb";
import User from "../Models/User";
import RoomCoin from "../Models/RoomCoinList";
import { statSync } from "fs";

export class Message extends Schema {

    @type("string")
    playerPhase = "idle";

    @type("number")
    opened = 0;

    @type("number")
    goaled = 0;

    @type("number")
    tokenid = 0;

    @type("number")
    dicevalue = 0;

    @type("string")
    opponentid = "";

    @type("int8")
    tokenpos = -1;
    @type("boolean")
    isMovedToken = false
    @type("boolean")
    connected = false
    @type("string")
    id = ""
    @type("int16")
    tokensaround=-1

}
export class TokenState extends Schema {
    @type("int8")
    _id = -1;
    @type("int8")
    pos = 0;
    @type("boolean")
    isOpened = false;
    @type("boolean")
    isGoaled = false;
    @type("int16")
    tokensaround=-1

}
export class Player extends Schema {
    @type("string")
    sessionId = "";

    @type("string")
    varifyId = "";

    @type("string")
    name = "";

    @type("int8")
    userprofile = 0;

    @type("number")
    seat = 0;

    @type("string")
    playerPhase = "idle";

    @type("number")
    opened = 0;

    @type("number")
    goaled = 0;

    @type("number")
    lazymoves = 0;

    @type("number")
    dicevalue = 0;

    @type("number")
    tokenid = 0;

    @type("string")
    opponentid = "";

    @type({ map: TokenState })
    mytokens = new MapSchema<TokenState>();

    @type("boolean")
    sync = false

    @type("boolean")
    Islazy = false

    @type("boolean")
    isRolledDice = false
    @type("boolean")
    isMovedToken = false
    @type("int8")
    tknOldPos = 0;

    @type("boolean")
    connected = false

    @type("boolean")
    CanOpenToken = false

    previousValues = new ArraySchema<any>();
    isUsedLuck:Boolean=false;

    hasExtraTurn:boolean=false;

    pushValue(val: any) {
        this.previousValues.unshift(val);
        if (this.previousValues.length >=10) {
            this.previousValues.pop();
        }
    }
    isNeedLuck(){
            let sixes: any = 0;

            if (this.previousValues.length >= 5) {
                for (let i = 0; i < 5; i++) {
                    if (this.previousValues[i] == 6) {
                        sixes++;
                    }
                }
                if(sixes==0&&!this.isUsedLuck){

                    this.isUsedLuck=true;
                    console.log(this.name+"is used his one time luck");
                    return true;

                }else{
                    return false
                }
            }else{
                return false
            }




        // else if (this.previousValues.length >= 9) {
        //         let count: any;

        //         for (let i = 0; i < 9; i++) {
        //             if (this.previousValues[i] == 6) {
        //                 count++;
        //             }
        //         }
        //         if (count == 0) {
        //             console.log(this.name + "need luck so much");
        //             return true;

        //         } else {
        //             return false
        //         }
        // }
    }
    isCrossedSixLimit() {
        let sixes: any = 0;

        if (this.previousValues.length >= 3) {
            for (let i = 0; i < 2; i++) {
                if (this.previousValues[i] == 6) {
                    sixes++;
                }
            }
        }
        if (sixes >= 2) {
            console.log(this.name+ "is crossed 6 limit")
            return true;

        } else {
            return false;
        }

    }
}
export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type("number")
    turn = 1;

    @type("string")
    gamePhase = "waiting";

    @type("number")
    time = 0;

    @type("number")
    readonly turndelay: number = 15000;

    @type("string")
     winner= "";

     @type("string")
     fee= "";

     @type("string")
     win= "";



    goalpos = 57;
    gameover:boolean=false;

    t: number = 0;

    seats: any = [];

    gameBody: any = {};

    something = "This attribute won't be sent to the l client-side";


    createPlayer(varifyId: string, id: string, seat: number,user_profile:number,user_name:string) {

        var dto :any;
        const i11d = { _id: new ObjectId(varifyId) };
        User.find(i11d).then((result: any) => {

            var dtx:any = result;
            dto = { varifyId: varifyId, colyseus_id: id, last_updated_user_coin:dtx.usercoins };
	        this.gameBody.players[seat - 1] = dto;


        }).catch((err: any) => {
            console.log(err);
            // console.log({ "error": err, "errorvalue": true });
        });

        var dta = { varifyId: varifyId, colyseus_id: id };

        console.log(JSON.stringify(dta));

        this.gameBody.players[seat - 1] = dta;

        //create player
        var p = new Player();
        //create tokens for player
        for (let i = 0; i < 4; i++) {
            let tkn = new TokenState();
            tkn._id = i;
            tkn.pos = 0;
            p.mytokens[i] = tkn;
        }
        p.seat = seat;
        p.sessionId = id;
        p.varifyId = varifyId
        p.name=user_name;
        p.userprofile=user_profile;
        this.seats.push(seat);
        this.players[id] = p;
        // console.log(p.seat);
    }
    removePlayer(id: string) {


        const index = this.seats.indexOf(this.players[id].seat);
        console.log(this.players[id].name," removed ") ;
        delete this.players[id];
        if (index > -1) {
            this.seats.splice(index, 1);
        }




    }
    randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}
export class SocketRoom extends Room<State> {
    moveabletkns:any[]=[];
    openabletkns:any[]=[];
    moveabletknscount:any;
    openabletknscount:any;

    onCreate(options: any) {

        this.setSeatReservationTime(20);
        this.setState(new State());

        this.onMessage("*", (client, message:Message) => {
            console.log(client.sessionId, "sent 'action' message: ");
                this.OnMessage(client, message);
        });

        console.log("StateHandlerRoom created!", options);
        this.setMetadata({ room_id: options.room_id, max_players: options.maxPlayers })
        if(options.room_type=="private"){
            this.setPrivate(true);
        }
        this.state.gameBody.players = [];
        this.maxClients = options.maxPlayers;
        console.log("this.maxClients");
        console.log(this.maxClients);
        console.log("this.maxClients");
        this.state.fee=options.fee;
        this.state.win=options.win;

    }
    onJoin(client: Client, options: any) {
        // console.log("client.sessionId");
        // console.log(client.sessionId);
        // console.log("client.sessionId");

       for (let key in this.state.players ) {

            if(this.state.players[key].varifyId==options.id){
                // client.send({connection:"terminated"});
                client.leave();
                return;
            }

       }
       console.log("Join Data set");
       console.log(options.id );
        console.log( client.sessionId );
        console.log( this.clients.length + 1 );
        console.log( options.user_profile);
        console.log(options.user_name);
        console.log("Join Data set");

        this.state.createPlayer(options.id, client.sessionId, this.clients.length ,options.user_profile,options.user_name);

        console.log("******************************************");
        console.log(client.id, "joined")
        console.log( this.state.players._indexes.size+1)
        console.log( this.maxClients);
        console.log("******************************************");

        if ( this.state.players._indexes.size+1 == this.maxClients) {

            this.state.gamePhase = "playing"

            console.log("this.state.gamePhase")
            console.log(this.state.gamePhase)

            //entry of room in mongodb
            // let setbody:any={};

            const id = { _id: new ObjectId(this.metadata.room_id) };
            RoomCoin.find(id).then((resultx1: any) => {

                var dtx1: any = resultx1;

                this.state.gameBody.room_coin_id = this.metadata.room_id;
                this.state.gameBody.coly_room_id = this.roomId;
                this.state.gameBody.max_players = this.metadata.max_players;
                this.state.gameBody.date_created = new Date(Date());
                this.state.gameBody.coins = dtx1.coins;

                RoomDetails.create(this.state.gameBody).then((result: any) => {
                    let data: any = result;
                    var state: any = data[0].players;

                     console.log("simulation started")
                    this.setSimulationInterval((deltaTime) => this.UpdateState(deltaTime), 1000);

                    for (let key in this.state.players) {

                        const id = { _id: new ObjectId(this.state.players[key].varifyId) };
                        User.find(id).then((result: any) => {
                            var dt: any = result;

                            const id = { _id: new ObjectId(this.metadata.room_id)};
                            RoomCoin.find(id).then((resultx: any) => {

                                var dtx: any = resultx;
                                if (dt.usercoins >= dtx.coins) {

                                    var coinsremain = dt.usercoins - dtx.coins;
                                    console.log(coinsremain);
                                    var updated_data_id = { _id: new ObjectId(dt._id) };
                                    var updated_data = {
                                        $set: { "usercoins": coinsremain }
                                    };
                                    console.log(updated_data);
                                    User.update(updated_data_id, updated_data).then(() => {

                                        // console.log({ "data": { "remaining-coins": coinsremain }, "errorvalue": false });

                                    }).catch((err: any) => {
                                        // console.log(err);
                                        // console.log({ "error": err, "errorvalue": true });
                                    });

                                } else {
                                    // console.log({ "error": "testing", "errorvalue": true });
                                }

                            }).catch((err: any) => {
                                // console.log({ "error": err, "errorvalue": true });
                            });
                        }).catch((err: any) => {
                            // console.log({ "error": err, "errorvalue": true });
                        });
                    }


                }).catch((error: any) => {
                    // console.log(error);
                });

            }).catch((err: any) => {
                // console.log({ "error": err, "errorvalue": true });
            });

            this.lock();

        } else {
            this.state.gamePhase = "waiting"
        }

    }
    async onLeave(client: Client, consented: boolean) {
        if(this.state.gamePhase=="waiting"){

            this.state.removePlayer(client.sessionId);

            let temseat=0;
            this.state.seats=[];
            for(let key in this.state.players){
                temseat++;
                this.state.players[key].seat=temseat;
                this.state.seats.push(temseat);

            }
        } else {
            var msgc = new Message();
            msgc.playerPhase = "finished_turn"

            if (consented) {
                //change the turn if its mine and im leaving
                if (this.state.turn == this.state.players[client.id].seat) {

                    this.onMessageHandle(client.id, msgc);

                }
                //remove the player
                this.state.removePlayer(client.sessionId);

                this.checkForLeaveWin(client.sessionId);

                client.leave();
                console.log(client.sessionId, "leaved");


            } else {
                try {
                    await this.allowReconnection(client, 120);
                    this.state.players[client.id].connected = true;
                    console.log("Reconnected Clint" + client.id);
                }
                catch{
                    console.log("PLAYER IS DISCONNECTED");
                    //change the turn if its mine and im leaving
                    if (this.state.turn == this.state.players[client.id].seat) {

                        this.onMessageHandle(client.id, msgc);


                    }
                    //remove the player
                    this.state.removePlayer(client.sessionId);

                    this.checkForLeaveWin(client.sessionId);
                    console.log("PLAYER IS DISCONNECTED");
                }

            }
        }

    }
    checkForLeaveWin(clientid:string){

        if(this.state.gameover==true){
            return;
        }

        let length = Object.keys(this.state.players).length
        console.log(this.state.gamePhase);
        if(this.state.gamePhase=="waiting"){
            return;
        }
        if(this.maxClients==2){
            console.log("win chk under maxclient")
            console.log("remaining clients= ",length);
            if(length==1){
                console.log("win chk under length")
                for(let key in this.state.players){
                    if(key!=clientid){

                        this.onWinner(key);
                        this.state.winner=key;
                        this.state.gameover=true;
                        // var msg1=new Message();
                        // msg1.playerPhase="winner"
                        // msg1.id=key;
                        // this.clients.forEach(c=>{
                        //     this.send(c,msg1);
                        // });
                        console.log( key+" is winner", "clients left ",length, this.state.gamePhase);
                        setTimeout(() =>
                         this.disconnect()
                        , 2000);

                    }
                }
            }
        }else if(this.maxClients==3){

                if(length==1){
                    for(let key in this.state.players){
                        if(key!=clientid){
                            this.onWinner(key);
                            this.state.winner=key;
                            this.state.gameover=true;
                            // var msg2=new Message();
                            // msg2.playerPhase="winner"
                            // msg2.id=key;
                            // this.clients.forEach(c=>{
                            //     this.send(c,msg2);
                            // });
                            console.log( key+" is winner", "clients left ",length , this.state.gamePhase);
                            setTimeout(() =>
                             this.disconnect()
                            , 2000);

                        }
                    }

            }

        }else if(this.maxClients==4){

                if(length==1){
                    for(let key in this.state.players){
                        if(key!=clientid){
                            this.onWinner(key);
                            this.state.winner=key;
                            this.state.gameover=true;
                            // var msg3=new Message();
                            // msg3.playerPhase="winner"
                            // msg3.id=key;
                            // this.clients.forEach(c=>{
                            //     this.send(c,msg3);
                            // });
                            console.log( key+" is winner", "clients left ",length, this.state.gamePhase);
                            setTimeout(() =>
                             this.disconnect()
                            , 2000);
                        }
                    }

            }

        }

    }
    OnMessage(client:Client, data: Message) {

        if (data) {
            this.onMessageHandle(client.sessionId, data);
            if(this.state.players[client.sessionId]){
                if (this.state.players[client.sessionId].goaled == 4) {
                    this.onWinner(client.sessionId);
                    this.state.winner=client.sessionId;
                    this.state.gameover=true;
                }
            }


        }

    }
    onMessageHandle(id:string,data:Message){
        let player:Player=this.state.players[id];

        let opponent:Player=this.state.players[data.opponentid];

        if (player == null) {
            return;
        }
        switch (data.playerPhase) {
            case "roll_dice":

                if (!player.Islazy) {
                    player.lazymoves = 0;
                }
                if (player.isRolledDice == false) {

                    if (player.isCrossedSixLimit()) {
                        let val = this.state.randomIntFromInterval(1, 5);
                        player.dicevalue = val;
                        player.pushValue(val);

                    } else {
                        var val = this.state.randomIntFromInterval(1, 6);
                        if (player.isNeedLuck()) {
                            console.log(player.name + " is getting luck=", 6);
                            player.dicevalue = 6;
                            player.pushValue(6);

                        } else if (!player.isNeedLuck()) {
                            console.log(player.name + " got = ", val);
                            player.dicevalue = val;
                            player.pushValue(val);
                        }
                    }
                    player.playerPhase = data.playerPhase;
                    if (player.dicevalue == 6) {
                        player.CanOpenToken = true;
                    }

                    player.isRolledDice = true;
                    setTimeout(() => {
                        player.hasExtraTurn=false;
                        this.checkfinish(player);
                    }, 500);

                }
                break;
            case "open_token":
                if (!player.mytokens[data.tokenid].isOpened) {
                    player.mytokens[data.tokenid].isOpened = true;
                    player.mytokens[data.tokenid].pos = 1;
                    player.mytokens[data.tokenid].isGoaled = false;
                    player.opened++;
                    player.CanOpenToken=false;
                    player.tokenid = data.tokenid;
                    player.isMovedToken = true;
                    player.playerPhase = data.playerPhase;
                    setTimeout(() => {
                        this.opentoken(player);
                    }, 500);

                }

                break;
            case "move_token":
                if (player.isMovedToken == false) {
                    player.mytokens[data.tokenid].pos = data.tokenpos;
                    player.tknOldPos = data.tokenpos;
                    player.tokenid = data.tokenid;
                    player.CanOpenToken=false;
                    player.isMovedToken = true;
                    player.playerPhase = data.playerPhase;
                    this.movetoken(player,data.tokenpos,data.tokenid);
                }
                break
            case "finished_turn":
                if(player.hasExtraTurn==false){
                const index =  this.state.seats.indexOf( player.seat)+1;
                if ( this.state.seats[index] != null) {
                    this.state.t =  this.state.seats[index];
                } else {
                    this.state.t =  this.state.seats[0];
                }
                this.state.turn =  this.state.t;
                this.state.time = 0;
                // this.gamePhase = "playing"
                player.isRolledDice=false;

                player.isMovedToken=false;
                player.Islazy = false;
                player.playerPhase = data.playerPhase;
                // console.log(this.turn ,"players turn");
            }

                break
            case "extra_turn":
                if(player.hasExtraTurn==false){
                player.hasExtraTurn=true;
                this.state.time = 0;
                this.state.turn =  player.seat;
                player.isMovedToken=false;
                player.isRolledDice=false;
                player.Islazy=false;
                player.playerPhase = data.playerPhase;
                }
                break

            case "goaled_token":
                if(!player.mytokens[data.tokenid].isGoaled){
                    player.mytokens[data.tokenid].isGoaled = true;
                    player.mytokens[data.tokenid].isOpened = false;
                    player.Islazy = false;
                    player.opened--;
                    player.goaled++;
                    player.playerPhase = data.playerPhase;
                    this.extraturn(id);
                    this.checkfinish(player);
                }

                break
            case "synced":
                player.sync = false;
                break
            case "connected":
                player.connected = data.connected;
            break

            case "hit_token":

                if(opponent.mytokens[data.tokenid].isOpened==true){

                    opponent.opened--;
                    opponent.mytokens[data.tokenid].isOpened = false;
                    opponent.mytokens[data.tokenid].isGoaled = false;
                    opponent.mytokens[data.tokenid].pos = -1;
                    opponent.tokenid = data.tokenid;
                    opponent.playerPhase = data.playerPhase;

                    this.extraturn(data.id);

                }
                break
            // case "hit_token":

            //     if(opponent.mytokens[data.tokenid].isOpened==true){
            //     opponent.mytokens[data.tokenid].isOpened = false;
            //     opponent.mytokens[data.tokenid].isGoaled = false;
            //     opponent.mytokens[data.tokenid].pos = -1;
            //     opponent.opened--;
            //     opponent.tokenid = data.tokenid;

            //     opponent.playerPhase = data.playerPhase;

            //     this.extraturn(id);
            //     }
            //     break

        }
    }
    extraturn(id:any){
        let player:Player=this.state.players[id];
        let msg= new Message();
        msg.playerPhase="extra_turn"
            setTimeout(() =>
            this.onMessageHandle(id,msg)
                                ,200);


    }
    onWinner(_id: string) {

        if (_id) {
            console.log(_id,"is winner");
            const id = { _id: new ObjectId(this.state.players[_id].varifyId) };
            User.find(id).then((result: any) => {
                var dt: any = result;

                const idcoin = { _id: new ObjectId(this.metadata.room_id) };
                // console.log(idcoin);
                RoomCoin.find(idcoin).then((resultx: any) => {

                    var dtx: any = resultx;
                    if (this.maxClients == 2) {
                        var nintypercent =  (dtx.players.twoplayers.totalcoins * 90) / 100;
                        var wonCoins = nintypercent;
                        var coinsremain = dt.usercoins + wonCoins;
                    } else if (this.maxClients == 4) {
                        // console.log(dtx.players.fourplayers);
                        var nintypercent = (dtx.players.fourplayers.totalcoins * 90) / 100;
                        // console.log(seventyfivepercent)
                        var wonCoins = nintypercent;
                        // console.log(wonCoins);
                        var coinsremain = dt.usercoins + wonCoins;

                    }else if (this.maxClients == 3) {
                        // console.log(dtx.players.fourplayers);
                        var nintypercent =  (dtx.players.threeplayers.totalcoins * 90) / 100;
                        // console.log(seventyfivepercent)
                        var wonCoins = nintypercent;
                        // console.log(wonCoins);
                        var coinsremain = dt.usercoins + wonCoins;

                    }
                    var updated_data_id_p = { _id: new ObjectId(dt._id) };
                    var updated_data_p = {
                        $set: {
                            "usercoins": coinsremain
                        }
                    };
                    User.update(updated_data_id_p, updated_data_p).then((resx: any) => {
                        var res: any = resx;
                        if (res.result.nModified == 1) {

                            var updated_data_id_x = { coly_room_id: this.roomId };
                            var updated_data_x = {
                                $set: {
                                    "winnerId": this.state.players[_id].varifyId,
                                    "date_modified": new Date(Date())
                                }
                            };

                            RoomDetails.update(updated_data_id_x, updated_data_x).then((resx: any) => {
                                var res: any = resx;
                                if (res.result.nModified == 1) {

                                }
                            }).catch((err: any) => {
                                // console.log(err);
                                // console.log({ "error": err, "errorvalue": true });
                            });
                        }
                    }).catch((err: any) => {
                        // console.log(err);
                        // console.log({ "error": err, "errorvalue": true });
                    });

                }).catch((err: any) => {
                    // console.log({ "error": err, "errorvalue": true });
                });



            }).catch((err: any) => {
                // console.log({ "error": err, "errorvalue": true });
            });

        }
        setTimeout(() =>
         this.disconnect()
        , 2000);
    }
    UpdateState(deltaTime: number) {

        this.state.time += deltaTime;
        if (this.state.time >= this.state.turndelay + 1000) {

            this.state.gamePhase = "out_of_time";

            for (let id in this.state.players) {
                if (this.state.players[id].seat == this.state.turn) {

                    if(this.state.time >= 25000){

                        let msg=new Message();
                        msg.playerPhase="finished_turn";
                        this.onMessageHandle(id,msg);
                        break;
                    }

                    if(this.state.players[id].lazymoves>=4){
                        this.broadcast(this.state.players[id].name+ " is crossed lazy limit");
                        this.lazycrossedleave(id);

                        break;
                    }

                    if (!this.state.players[id].Islazy && !this.state.players[id].isMovedToken) {
                        this.state.players[id].Islazy = true;
                        this.state.players[id].lazymoves++;

                        this.onLazy(id);
                        break;
                    }


                }

            }

        }

    }
    async onLazy(id: string) {


        let tokens = this.state.players[id].mytokens;
        let player = this.state.players[id];

        if (!player.isRolledDice) {
            let msg1 = new Message();
            msg1.playerPhase = "roll_dice";
            this.onMessageHandle(id, msg1);
            console.log(this.state.players[id].name, " lazy dice roll")
            // await new Promise(r => setTimeout(r, 600));
            setTimeout(() =>
            this.OnLazyActions(id, player, tokens)
            , 600);

            // this.OnLazyActions(id, player, tokens);
        } else {
            console.log(this.state.players[id].name, " lazy dice rolled just moving")
            this.OnLazyActions(id, player, tokens);
        }

    }
    movetoken(player:Player,to:number,tid:any){
        let t:TokenState = player.mytokens[tid];

        if(to==57){
            let time = (player.dicevalue / 3) * 1000;
            setTimeout(() =>{
           this.goaltoken(player,tid);

            },time);
        }else
        if(player.dicevalue==6){
            let time = (player.dicevalue / 3) * 1000;
            setTimeout(() =>{
            this.extraturn(player.sessionId)

            },time);
        }else{
            let time = (player.dicevalue / 2.5) * 1000;
            setTimeout(() =>{
                if(!player.hasExtraTurn){
                    if(to!=57){
                        this. finishturn(player.sessionId);
                    }
                }
            },time);
        }

    }
    opentoken(player:Player){
        this.extraturn(player.sessionId);
    }
    goaltoken(player: Player, tid: any) {

        let msg = new Message();
        msg.playerPhase = "goaled_token";
        msg.goaled = 1;
        msg.tokenid = tid;
        // setTimeout(() => {
            this.onMessageHandle(player.sessionId, msg);
        // }, 10)
        if(player){
            if (player.goaled == 4&&this.state.gameover==false) {
                this.onWinner(player.sessionId);
                this.state.winner=player.sessionId;
                this.state.gameover=true;
            }
        }




    }
    checkfinish(player:Player){
        this.CollectPlayerData(player, player.dicevalue);

        if (this.moveabletknscount == 0 && this.openabletknscount == 0) {
            setTimeout(() => {
                this.finishturn(player.sessionId);
            }, 400);

        } else {
            if (player.dicevalue != 6) {
                if (this.moveabletknscount < 1) {
                    setTimeout(() => {
                        this.finishturn(player.sessionId);
                    }, 400);
                }
            }
        }
        player.isRolledDice = true;
        setTimeout(() => {
            player.hasExtraTurn=false;
        }, 1000);
    }
    finishturn(id:string){
        let msg= new Message();
        msg.playerPhase="finished_turn"
        setTimeout(() =>
        this.onMessageHandle(id,msg)
                            ,200);
    }
    OnLazyActions(id: string, player: Player, tokens: any) {
        if(!player){

                return;
        }
        let value=  player.dicevalue;

        this.CollectPlayerData(player,value);

        console.log(player.name, "has" + this.moveabletknscount+" moveable")
        console.log(player.name, "has" + this.openabletknscount+" openable")
        if(this.moveabletknscount==0&&this.openabletknscount==0){
            this.finishturn(player.sessionId);
            return;
        }else{
            if(value==6){
                // availableall(true);
                if(this.moveabletknscount<1&&this.openabletknscount>0){
                    this.lazyAutoOpen(id,value);
                }else if(this.moveabletknscount>0){
                    this.lazyAutoMove(id,value);
                }
            }else{

                if(this.moveabletknscount>0){
                      this.lazyAutoMove(id,value);

                }else{
                    this.finishturn(player.sessionId);
                    return;
                }
            }
        }




    }
    lazyAutoOpen(id:string,value:any ){
        if( !this.state.players[id]){
            return;
        }
            for(let t in this.openabletkns){
                if(this.openabletkns[t]){
                    let msg = new Message();
                    msg.playerPhase = "open_token";
                    msg.opened = 1;
                    msg.tokenid = this.openabletkns[t]._id;
                    this.onMessageHandle(id, msg);

                    this.state.players[id].Islazy = false;
                    break;
                }

            }
    }
    lazyAutoMove(id:string,value:any){
        if( !this.state.players[id]){
            return;
        }
            for(let t in this.moveabletkns){
                if(this.moveabletkns[t]){
                    let msg = new Message();
                    msg.playerPhase = "move_token";

                    msg.tokenid = this.moveabletkns[t]._id;
                    msg.tokenpos =  this.moveabletkns[t].pos +value;
                    this.onMessageHandle(id, msg);

                      break;
                }
            }
    }
    onDispose() {

        console.log("Dispose StateHandlerRoom lol1234...");

    }
    lazycrossedleave(id:string) {

            var msgc = new Message();
             msgc.playerPhase = "finished_turn"

          //change the turn if its mine and im leaving
          if (this.state.turn == this.state.players[id].seat) {

            this.onMessageHandle(id, msgc);

            }
            this.state.removePlayer(id);

            this.checkForLeaveWin(id);

            console.log(id, "leaved");
    }
    CollectPlayerData(player:Player,value:any){
        this.moveabletkns =[];
        this.openabletkns =[];
        this.moveabletknscount=0;
        this.openabletknscount=0;


        for(let key in player.mytokens){
            let t =player.mytokens[key];
            if(t.isOpened&&!t.isGoaled&&(t.pos+value)<=this.state.goalpos){
                this.moveabletkns.push(t);
            }
        }
        this.moveabletknscount=this.moveabletkns.length;

        for(let key in player.mytokens){
            let t =player.mytokens[key];
            if(!t.isOpened&&!t.isGoaled&&(t.pos+value)<=this.state.goalpos){
                this.openabletkns.push(t);
            }
        }
        this.openabletknscount=this.openabletkns.length;
    }
}

