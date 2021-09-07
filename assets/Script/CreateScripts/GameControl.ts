// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EnemyControl from "./EnemyControl";
import Player from "./Player";
import PlayerPowerUp from "./PlayerPowerUp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerControl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Label)
    GameOver_text: cc.Label = null;

    @property(cc.Button)
    Start_Btn: cc.Button = null;

    @property(cc.Node)
    Player_Obj: cc.Node = null;

    @property(cc.Node)
    Panel_Hining: cc.Node = null;

    @property(cc.Node)
    MainNode: cc.Node = null;

    @property(cc.Node)
    Pos_Health: cc.Node = null;

    @property(cc.Node)
    Pos_: cc.Node = null;

    @property(cc.Prefab)
    Enemy: cc.Prefab = null;

    @property(cc.Prefab)
    EFX: cc.Prefab = null;

    @property(cc.Prefab)
    Health_: cc.Prefab = null;

    @property(cc.Prefab)
    PrefabsFile: cc.Prefab = null;

    @property(cc.AudioSource)
    BGM_: cc.AudioSource = null;

    PowerUp : PlayerPowerUp;

    @property
    PlayerHealth = 3;

    @property
    PlayerMaxHealth = 0;

    @property
    Speed = 0;

    @property
    Fire_Rate = 1;

    @property 
    MinEnemy = 20;

    @property
    MaxEnemy = 30;

    public Health_Pic: cc.Node[];
    public GetPos_: cc.Vec2[];
    EN_SpawnPos: cc.Vec2[];
    public HitStack = 0;

    Right: boolean;
    Left: boolean;
    SpawnBullect: boolean;
    GameRunning: boolean;

    CountTime = 0;
    scrorePlayer = 0;

    CountEnemy = 0;
    CountTime_SpEnemy = 0;
    Rate_SpawnEnemy = 0.6;

    CountFireEN = 0;
    En_Fire = 1;
    LimitMove = 0;
    CountTimePlay = 0;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
       
        this.PowerUp = this.node.getComponent(PlayerPowerUp);
        this.GetPos_ = new Array();
        this.LimitMove = this.MainNode.getComponent(cc.Canvas).designResolution.width;
        this.GetCurrentPos_OnScene();
    }

    GetCurrentPos_OnScene() {
        this.EN_SpawnPos = new Array();
        for (let i = 0; i < this.MaxEnemy; i++) {
            var PreSp = cc.instantiate(this.Enemy);
            PreSp.parent = this.Pos_;
        }
        setTimeout(function () {
            this.ColletPosition();
        }.bind(this), 0.1);
    }
    ColletPosition() {
        for (let i = 0; i < this.Pos_.childrenCount; i++) {
            this.EN_SpawnPos.push(this.Pos_.children[i].getPosition());
        }
        for (let i = 0; i < this.Pos_.childrenCount; i++) {
            this.Pos_.children[i].destroy();
        }
        this.Pos_.getComponent(cc.Layout).type = cc.Layout.Type.NONE;
        this.SetEnemy_BeforeStart();
    }
    SetEnemy_BeforeStart() {
        for (let i = 0; i < this.MinEnemy; i++) {
            this.RanPositionEn();
        }
    }

    public startGame() {
        this.GameRunning = true;
        this.Panel_Hining.active = false;
        this.Start_Btn.node.active = false;
        this.Spawn_PlayerHealth();
        this.BGM_.play();
    }

    update(dt) {
        if (this.GameRunning == true) {

            if (this.Right == true) {
                if (this.Player_Obj.getPosition().x <= (this.LimitMove / 2) - (this.Player_Obj.width)*0.3) {
                    this.Player_Obj.x += this.Speed * dt;
                }
                else {
                    this.Player_Obj.x += 0;
                }
            }
            else if (this.Left == true) {
                if (this.Player_Obj.getPosition().x >= -(this.LimitMove / 2) + (this.Player_Obj.width)*0.3) {
                    this.Player_Obj.x -= this.Speed * dt;
                }
                else {
                    this.Player_Obj.x -= 0;
                }
            }

            if (this.SpawnBullect == true) {
                this.CountTime += dt;
                if (this.CountTime >= this.Fire_Rate) {
                    this.Spawn_Bullect();
                    this.CountTime = 0;
                }
            }

            this.CountTime_SpEnemy += dt;
            if (this.CountEnemy < 20) {
                this.RanPositionEn();
                this.CountTime_SpEnemy = 0;
            }
            else if (this.CountEnemy >= 20 && this.CountEnemy < this.MaxEnemy && this.CountTime_SpEnemy >= this.Rate_SpawnEnemy) {
                this.RanPositionEn();
                this.CountTime_SpEnemy = 0;
            }

            this.CountFireEN += dt;           
            if (this.CountFireEN >= this.En_Fire) {
                var En_FirePos = Math.floor(Math.random() * this.Pos_.childrenCount);
                this.Pos_.children[En_FirePos].getComponent(EnemyControl).En_Bullect();
                this.CountFireEN = 0;
            }

            this.CountTimePlay+=dt; 
            if(this.CountTimePlay >= 30 && this.En_Fire >= 0.5){
                this.En_Fire -= 0.1;                
                this.CountTimePlay = 0;
            }                     
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.Right = true;
                break;

            case cc.macro.KEY.left:
                this.Left = true;
                break;

            case cc.macro.KEY.space:
                this.SpawnBullect = true;
                break;

        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.right:
                this.Right = false;
                break;

            case cc.macro.KEY.left:
                this.Left = false;
                break;

            case cc.macro.KEY.space:
                this.SpawnBullect = false;
                break;
        }
    }

    Spawn_PlayerHealth() {
        this.Health_Pic = new Array();
        for (let i = 0; i < this.PlayerHealth; i++) {
            var H_P = cc.instantiate(this.Health_)
            H_P.parent = this.Pos_Health;
        }
    }

    Spawn_Bullect() {
        var Bullect_ = cc.instantiate(this.PrefabsFile);
        this.Player_Obj.getComponent(Player).SFX_.play();
        Bullect_.color = cc.Color.GREEN;
        Bullect_.parent = this.MainNode;
        Bullect_.setPosition(this.Player_Obj.x, this.Player_Obj.y + 100);
        setTimeout(function () {
            Bullect_.destroy();
        }.bind(this), 4000);
    }

    public CallScore() {
        if (this.GameRunning == true) {
            this.CountEnemy--;
            this.CountTime_SpEnemy = 0;
            this.scrorePlayer += 1;
            this.HitStack += 1;
            this.PlayerPlusHealth();
            this.label.string = "Score : " + this.scrorePlayer.toString()
        }
    }

    PlayerPlusHealth() {
        if (this.HitStack % 50 == 0) {
            if (this.PlayerHealth < this.PlayerMaxHealth) {
                this.PlayerHealth += 1;
                var H_P = cc.instantiate(this.Health_)
                H_P.parent = this.Pos_Health;
            }
        }
    }

    RanPositionEn() {
        var En_Pos = Math.floor(Math.random() * this.EN_SpawnPos.length);
        this.Spawn_Enemy(this.EN_SpawnPos[En_Pos]);
        this.EN_SpawnPos.splice(En_Pos, 1);
    }

    Spawn_Enemy(PosSP: cc.Vec2) {
        var Enemy_ = cc.instantiate(this.Enemy);
        Enemy_.parent = this.Pos_;
        Enemy_.setPosition(PosSP);
        this.CountEnemy++;
        this.SetEnemy_IN_Array();
    }

    SetEnemy_IN_Array() {
        setTimeout(function () {
            this.GetPos_.push(this.Pos_.children[this.Pos_.childrenCount - 1].getPosition())
        }.bind(this), 0.1);
    }

    public GameOver() {
        this.GameRunning = false;
        this.BGM_.stop();
        this.GameOver_text.node.active = true;
    }

    public PlayGameAgain() {
        cc.director.loadScene("ObjMovement");
    }
}
