// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//import { Default_Value_Setting } from "./Default_Value_Setting";
import { Default_Value_Setting } from "./Default_Value_Setting";
import EnemyControl from "./EnemyControl";
import PowerManager from "./PowerManager";
import Sound_Setting from "./Sound_Setting";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameControl extends cc.Component {

    static Instance: GameControl = null;

    @property(cc.Label)
    private Score_Text: cc.Label = null;

    @property(cc.Label)
    private ComboHit_Text: cc.Label = null;

    @property(cc.Button)
    private Start_Btn: cc.Button = null;

    @property(cc.Button)
    private Play_Again_Btn: cc.Button = null;

    @property(cc.Node)
    private GameOver_Node: cc.Node = null;

    @property(cc.Node)
    private Parent_Pos_Enemy: cc.Node = null;

    @property(cc.Node)
    public Player_Obj: cc.Node = null;

    @property(cc.Node)
    private Panel_Hiding: cc.Node = null;

    @property(cc.Node)
    public Canvas_Node: cc.Node = null;

    @property(cc.Node)
    public Pos_Health: cc.Node = null;

    @property(cc.Node)
    public Pos_ShowBuff: cc.Node = null;

    @property(cc.Prefab)
    public Prefabs_Bullet: cc.Prefab = null;

    @property(cc.Prefab)
    public Enemy: cc.Prefab = null;

    @property(cc.Prefab)
    public Boom_EFX: cc.Prefab = null;

    @property(cc.Prefab)
    private Health_Prefabs: cc.Prefab = null;

    @property(cc.Prefab)
    private Health_EFX: cc.Prefab = null;

    @property(cc.Prefab)
    private Plus_HP: cc.Prefab = null;

    public PowerManager: PowerManager;
    public DefVal: Default_Value_Setting = null;
    private Sound_Setting: Sound_Setting;

    @property
    public Speed = 0;

    @property
    public Fire_Rate = 1;

    @property
    private Enamy_FireRate = 1.5;

    @property
    private PlayerHealth = 3;

    @property
    private PlayerMaxHealth = 5;

    @property
    private MinEnemy = 20;

    @property
    private MaxEnemy = 30;

    public Health_Pic: cc.Node[];
    public GetPos_: cc.Vec2[];
    public EN_SpawnPos: cc.Vec2[];

    public GameRunning: boolean;
    public BuffShild: boolean = false;

    /*private Right: boolean;
    private Left: boolean;*/
    private SpawnBullect: boolean;

    private CountTime = 0;
    private scrorePlayer = 0;
    private HitStack = 0;

    private CountEnemy = 0;
    private CountTime_SpEnemy = 0;
    private Rate_SpawnEnemy = 0.6;

    private CountFireEN = 0;

    //private LimitMove = 0;
    private CountTimePlay = 0;

    onLoad() {

        GameControl.Instance = this;

        if (this.DefVal == null) {
            this.DefVal = Default_Value_Setting.getInstance();
        }
        if (this.DefVal.Def_Speed == null && this.DefVal.Def_FireRate == null) {
            this.DefVal.Player_Def_Value(this.Speed, this.Fire_Rate);
        }

        this.PowerManager = this.node.getComponent(PowerManager);
        this.Sound_Setting = this.node.getComponent(Sound_Setting);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.GetPos_ = new Array();
        //this.LimitMove = this.Canvas_Node.getComponent(cc.Canvas).designResolution.width;
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
            GameControl.Instance.ColletPosition();
        }, 10);
    }

    ColletPosition() {

        for (let i = 0; i < this.Parent_Pos_Enemy.childrenCount; i++) {
            this.EN_SpawnPos.push(this.Parent_Pos_Enemy.children[i].getPosition());
        }

        this.Parent_Pos_Enemy.destroyAllChildren();
        this.Parent_Pos_Enemy.getComponent(cc.Layout).enabled = false;

        for (let i = 0; i < this.MinEnemy; i++) {
            this.RanPositionEnemy();
        }
    }

    public startGame() {

        this.GameRunning = true;
        this.Start_Btn.node.active = false;
        this.Panel_Hiding.active = false;
        this.Spawn_PlayerHealth();
        this.Sound_Setting.BGM_Sound.play();
    }


    update(dt) {

        if (this.GameRunning == true) {

            /*if (this.Right == true) {
                let LimitRight = (this.Player_Obj.getPosition().x <= (this.LimitMove / 2) - (this.Player_Obj.width) * 0.3)
                if (LimitRight) {
                    this.Player_Obj.x += this.Speed * dt;
                }
            }
            else if (this.Left == true) {
                let LimitLeft = (this.Player_Obj.getPosition().x >= -(this.LimitMove / 2) + (this.Player_Obj.width) * 0.3)
                if (LimitLeft) {
                    this.Player_Obj.x -= this.Speed * dt;
                }
            }*/

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
                this.RanPositionEnemy();
            }
            else if (Case_EnemyMorethan_20) {
                this.RanPositionEnemy();
            }

            this.CountFireEN += dt;
            if (this.CountFireEN >= this.Enamy_FireRate) {
                let En_FirePos = Math.floor(Math.random() * this.Parent_Pos_Enemy.childrenCount);
                this.Parent_Pos_Enemy.children[En_FirePos].getComponent(EnemyControl).En_Bullect();
                this.CountFireEN = 0;
            }

            this.CountTimePlay += dt;
            if (this.CountTimePlay >= 20 && this.Enamy_FireRate >= 0.2) {                
                this.Enamy_FireRate -= 0.1;
                this.CountTimePlay = 0;
            }
        }
    }

    private onKeyDown(event) {

        switch (event.keyCode) {
            /*case cc.macro.KEY.right:
                this.Right = true;
                break;

            case cc.macro.KEY.left:
                this.Left = true;
                break;
*/
            case cc.macro.KEY.space:
                this.SpawnBullect = true;
                break;

        }
    }
    private onKeyUp(event) {

        switch (event.keyCode) {
           /* case cc.macro.KEY.right:
                this.Right = false;
                break;

            case cc.macro.KEY.left:
                this.Left = false;
                break;
*/
            case cc.macro.KEY.space:
                this.SpawnBullect = false;
                break;
        }
    }

    private Spawn_PlayerHealth() {

        this.Health_Pic = new Array();
        for (let i = 0; i < this.PlayerHealth; i++) {
            let H_P = cc.instantiate(this.Health_Prefabs)
            H_P.parent = this.Pos_Health;
            this.PicHealthScaleUp(H_P);
        }
    }

    private PicHealthScaleUp(NodeRunaction) {
        let ScaleUp = cc.scaleTo(0.2, 1)
        NodeRunaction.runAction(ScaleUp);
    }

    private Spawn_Bullect() {

        let Bullect_ = cc.instantiate(this.Prefabs_Bullet);
        this.Sound_Setting.SFX_Sound.play();
        Bullect_.parent = this.Canvas_Node;
        Bullect_.setPosition(this.Player_Obj.x, this.Player_Obj.y + 100);
    }


    public CallScore() {

        if (this.GameRunning == true) {
            this.CountEnemy--;
            this.CountTime_SpEnemy = 0;
            this.scrorePlayer += 1;
            this.Hit_and_GetHit_Ststus(true);
            this.Score_Text.string = "Score : " + this.scrorePlayer.toString()

            let Hit_Bleeding = cc.sequence(cc.scaleTo(0.05, 0.7, 0.7), cc.scaleTo(0.05, 1, 1));
            this.ComboHit_Text.node.runAction(Hit_Bleeding);
        }
    }

    public Hit_and_GetHit_Ststus(Hit_Status: boolean, Damage = 0) {

        if (Hit_Status == true) {
            this.HitStack += 1;
            this.ComboHit_Text.node.active = true;
            this.ComboHit_Text.string = "HIT : " + this.HitStack.toString();
            if (this.HitStack % 50 == 0 && this.Check_MaxHP() == false) {
                this.PlayerPlusHealth();
                this.ShowPlus_HP();
            }
        }
        else {
            if (this.BuffShild == true) {
                this.Player_Obj.children[0].destroy();
                this.BuffShild = false;
            }
            else {
                this.PlayerHealth = this.PlayerHealth - Damage;
                this.HitStack = 0;
                this.ComboHit_Text.node.active = false;

                this.Destory_Heart_Picture(Damage);

                this.PowerManager.Player_Lost_Buff();
                if (this.PlayerHealth <= 0) {
                    this.GameOver();
                }
            }
        }
    }

    private Destory_Heart_Picture(RoundDestory) {

        let Current_Pic = this.Pos_Health.childrenCount;
        if (Current_Pic - RoundDestory < 0) {
            RoundDestory = Current_Pic;
        }

        for (let i = 0; i < RoundDestory; i++) {

            let GetPosX = this.Pos_Health.children[this.Pos_Health.childrenCount - 1].x;
            let GetPosY = this.Pos_Health.y

            let Hp_EFX = cc.instantiate(this.Health_EFX);

            Hp_EFX.parent = this.Canvas_Node;
            Hp_EFX.setPosition(GetPosX, GetPosY);
            let Action = cc.sequence(cc.delayTime(0.5), cc.destroySelf());
            Hp_EFX.runAction(Action);
            this.Pos_Health.children.splice(this.Pos_Health.childrenCount - 1, 1);
        }

    }

    private ShowPlus_HP() {

        let AddHP = cc.instantiate(this.Plus_HP);
        AddHP.parent = this.Canvas_Node;
        AddHP.setPosition(0, 20);
        let movetment = cc.sequence(cc.moveBy(0.5, 0, AddHP.y + 40), cc.destroySelf());
        AddHP.runAction(movetment);
    }    

    public PlayerPlusHealth() {

        let MaxHP = this.Check_MaxHP();

        if (MaxHP == false) {

            this.PlayerHealth += 1;
            let H_P = cc.instantiate(this.Health_Prefabs);
            H_P.parent = this.Pos_Health;
            this.PicHealthScaleUp(H_P);
        }
    }

    public Check_MaxHP() {

        let Status = false;
        if (this.PlayerHealth == this.PlayerMaxHealth) {
            Status = true;
        }
        return Status;
    }

    public GetPosition_StandbyPush(PositionNode: cc.Vec2) {

        setTimeout(function () {
            GameControl.Instance.EN_SpawnPos.push(PositionNode);
        }, 10);
    }

    private RanPositionEnemy() {

        let En_Pos = Math.floor(Math.random() * this.EN_SpawnPos.length);
        this.Spawn_Enemy(this.EN_SpawnPos[En_Pos]);
        this.EN_SpawnPos.splice(En_Pos, 1);
        this.CountTime_SpEnemy = 0;
    }

    private Spawn_Enemy(PosSP: cc.Vec2) {

        let Enemy_ = cc.instantiate(this.Enemy);
        Enemy_.parent = this.Parent_Pos_Enemy;
        Enemy_.setPosition(PosSP);
        let EnemyScaleUp = cc.scaleTo(0.5, 1, 1);
        Enemy_.runAction(EnemyScaleUp);

        this.CountEnemy++;

        setTimeout(function () {
            GameControl.Instance.SetEnemy_IN_Array();
        }, 1);
    }

    private SetEnemy_IN_Array() {

        this.GetPos_.push(this.Parent_Pos_Enemy.children[this.Parent_Pos_Enemy.childrenCount - 1].getPosition())
    }

    public GameOver() {

        this.GameRunning = false;
        this.Sound_Setting.BGM_Sound.stop();
        this.GameOver_Node.active = true;

        let Get_GO_Text = this.GameOver_Node.children[0];
        let Text_Scale = cc.sequence(cc.scaleTo(0.2, 0.95, 0.95), cc.scaleTo(0.2, 1, 1)).repeatForever();
        Get_GO_Text.runAction(Text_Scale);
    }

    public PlayGameAgain() {
        cc.director.loadScene("ObjMovement");
    }
}