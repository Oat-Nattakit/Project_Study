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
    private Score_Text: cc.Label = null;

    @property(cc.Label)
    private GameOver_text: cc.Label = null;

    @property(cc.Label)
    private ComboHit_Text: cc.Label = null;

    @property(cc.Button)
    private Start_Btn: cc.Button = null;

    @property(cc.Button)
    private Play_Again_Btn: cc.Button = null;

    @property(cc.Node)
    private Parent_Pos_Enemy: cc.Node = null;

    @property(cc.Node)
    private Player_Obj: cc.Node = null;

    @property(cc.Node)
    private Panel_Hiding: cc.Node = null;

    @property(cc.Node)
    public Canvas_Node: cc.Node = null;

    @property(cc.Node)
    public Pos_Health: cc.Node = null;

    @property(cc.Prefab)
    public Enemy: cc.Prefab = null;

    @property(cc.Prefab)
    public EFX: cc.Prefab = null;

    @property(cc.Prefab)
    private Health_: cc.Prefab = null;

    @property(cc.Prefab)
    public Prefabs_Bullet: cc.Prefab = null;

    @property(cc.AudioSource)
    private BGM_: cc.AudioSource = null;

    public PowerUp: PlayerPowerUp;

    @property
    public Speed = 0;

    @property
    public Fire_Rate = 1;

    @property
    public PlayerHealth = 3;

    @property
    private PlayerMaxHealth = 0;

    @property
    private MinEnemy = 20;

    @property
    private MaxEnemy = 30;

    public Health_Pic: cc.Node[];
    public GetPos_: cc.Vec2[];
    public EN_SpawnPos: cc.Vec2[];

    public GameRunning: boolean;

    private Right: boolean;
    private Left: boolean;
    private SpawnBullect: boolean;

    private CountTime = 0;
    private scrorePlayer = 0;
    private HitStack = 0;

    private CountEnemy = 0;
    private CountTime_SpEnemy = 0;
    private Rate_SpawnEnemy = 0.6;

    private CountFireEN = 0;
    private Enamy_FireRate = 1;
    private LimitMove = 0;
    private CountTimePlay = 0;

    onLoad() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.PowerUp = this.node.getComponent(PlayerPowerUp);
        this.GetPos_ = new Array();
        this.LimitMove = this.Canvas_Node.getComponent(cc.Canvas).designResolution.width;
        this.GetCurrentPos_OnScene();

        this.Start_Btn.node.on('click', this.startGame, this);
        this.Play_Again_Btn.node.on('click', this.PlayGameAgain, this);
    }

    private GetCurrentPos_OnScene() {

        this.EN_SpawnPos = new Array();
        for (let i = 0; i < this.MaxEnemy; i++) {
            let PreSp = cc.instantiate(this.Enemy);
            PreSp.parent = this.Parent_Pos_Enemy;
        }
        setTimeout(function () {
            this.ColletPosition();
        }.bind(this), 0.1);
    }

    ColletPosition() {

        for (let i = 0; i < this.Parent_Pos_Enemy.childrenCount; i++) {
            this.EN_SpawnPos.push(this.Parent_Pos_Enemy.children[i].getPosition());
        }
        for (let i = 0; i < this.Parent_Pos_Enemy.childrenCount; i++) {
            this.Parent_Pos_Enemy.children[i].destroy();
        }
        this.Parent_Pos_Enemy.getComponent(cc.Layout).type = cc.Layout.Type.NONE;
        this.SetEnemy_BeforeStart();
    }

    private SetEnemy_BeforeStart() {

        for (let i = 0; i < this.MinEnemy; i++) {
            this.RanPositionEn();
        }
    }

    public startGame() {

        this.GameRunning = true;
        this.Panel_Hiding.active = false;
        this.Start_Btn.node.active = false;
        this.Spawn_PlayerHealth();
        this.BGM_.play();
    }

    update(dt) {

        if (this.GameRunning == true) {

            if (this.Right == true) {
                let LimitRight = (this.Player_Obj.getPosition().x <= (this.LimitMove / 2) - (this.Player_Obj.width) * 0.3)
                if (LimitRight) {
                    this.Player_Obj.x += this.Speed * dt;
                }
                else {
                    this.Player_Obj.x += 0;
                }
            }
            else if (this.Left == true) {
                let LimitLeft = (this.Player_Obj.getPosition().x >= -(this.LimitMove / 2) + (this.Player_Obj.width) * 0.3)
                if (LimitLeft) {
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
            let Case_EnemyMorethan_20 = (this.CountEnemy >= 20 && this.CountEnemy < this.MaxEnemy && this.CountTime_SpEnemy >= this.Rate_SpawnEnemy);

            if (this.CountEnemy < 20) {
                this.RanPositionEn();
                this.CountTime_SpEnemy = 0;
            }
            else if (Case_EnemyMorethan_20) {
                this.RanPositionEn();
                this.CountTime_SpEnemy = 0;
            }

            this.CountFireEN += dt;
            if (this.CountFireEN >= this.Enamy_FireRate) {
                let En_FirePos = Math.floor(Math.random() * this.Parent_Pos_Enemy.childrenCount);
                this.Parent_Pos_Enemy.children[En_FirePos].getComponent(EnemyControl).En_Bullect();
                this.CountFireEN = 0;
            }

            this.CountTimePlay += dt;
            if (this.CountTimePlay >= 30 && this.Enamy_FireRate >= 0.4) {
                this.Enamy_FireRate -= 0.1;
                this.CountTimePlay = 0;
            }
        }
    }

    private onKeyDown(event) {

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
    private onKeyUp(event) {

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

    private Spawn_PlayerHealth() {

        this.Health_Pic = new Array();
        for (let i = 0; i < this.PlayerHealth; i++) {
            let H_P = cc.instantiate(this.Health_)
            H_P.parent = this.Pos_Health;
        }
    }

    private Spawn_Bullect() {

        let Bullect_ = cc.instantiate(this.Prefabs_Bullet);
        this.Player_Obj.getComponent(Player).SFX_.play();
        Bullect_.color = cc.Color.GREEN;
        Bullect_.parent = this.Canvas_Node;
        Bullect_.setPosition(this.Player_Obj.x, this.Player_Obj.y + 100);
    }


    public CallScore() {

        if (this.GameRunning == true) {
            this.CountEnemy--;
            this.CountTime_SpEnemy = 0;
            this.scrorePlayer += 1;
            this.ComBoHitEnemy(true);
            this.Score_Text.string = "Score : " + this.scrorePlayer.toString()
        }
    }

    public ComBoHitEnemy(Hit_Status: boolean) {

        if (Hit_Status == true) {
            this.HitStack += 1;
            this.ComboHit_Text.node.active = true;
            this.ComboHit_Text.string = "HIT : " + this.HitStack.toString();
            if (this.HitStack % 50 == 0) {
                this.PlayerPlusHealth();
            }
        }
        else {
            this.ComboHit_Text.node.active = false;
            this.HitStack = 0;
        }
    }

    public PlayerPlusHealth() {

        if (this.PlayerHealth < this.PlayerMaxHealth) {
            this.PlayerHealth += 1;
            let H_P = cc.instantiate(this.Health_)
            H_P.parent = this.Pos_Health;
        }
    }

    public GetPosition_StandbyPush(PositionNode: cc.Vec2) {

        setTimeout(function () {
            this.EN_SpawnPos.push(PositionNode);
        }.bind(this), 10);
    }

    private RanPositionEn() {

        let En_Pos = Math.floor(Math.random() * this.EN_SpawnPos.length);
        this.Spawn_Enemy(this.EN_SpawnPos[En_Pos]);
        this.EN_SpawnPos.splice(En_Pos, 1);
    }

    private Spawn_Enemy(PosSP: cc.Vec2) {

        let Enemy_ = cc.instantiate(this.Enemy);
        Enemy_.parent = this.Parent_Pos_Enemy;
        Enemy_.setPosition(PosSP);

        let EnemyScaleUp = cc.scaleTo(0.5, 1, 1);
        Enemy_.runAction(EnemyScaleUp);

        this.CountEnemy++;

        setTimeout(function () {
            this.SetEnemy_IN_Array();
        }.bind(this), 0.1);
    }

    SetEnemy_IN_Array() {

        this.GetPos_.push(this.Parent_Pos_Enemy.children[this.Parent_Pos_Enemy.childrenCount - 1].getPosition())
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
