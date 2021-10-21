// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//import { Default_Value_Setting } from "./Default_Value_Setting";
import { Default_Value_Setting } from "./Default_Value_Setting";
import Enemy_Manager from "./EnemyManage/Enemy_Manager";
import PowerManager from "./PowerManager/PowerManager";

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
    public Boom_EFX: cc.Prefab = null;

    @property(cc.Prefab)
    private Health_Prefabs: cc.Prefab = null;

    @property(cc.Prefab)
    private Health_EFX: cc.Prefab = null;

    @property(cc.Prefab)
    private Plus_HP: cc.Prefab = null;

    public PowerManager: PowerManager;
    public DefVal: Default_Value_Setting = null;
    public Sound_Setting: Sound_Setting;
    public SpawnEnemy : Enemy_Manager;

    @property
    public Speed = 0;

    @property
    public Fire_Rate = 1;

    @property
    private PlayerHealth = 3;

    @property
    private PlayerMaxHealth = 5;   

    public Health_Pic: cc.Node[];

    public GameRunning: boolean;
    public BuffShild: boolean = false;

    private scrorePlayer = 0;
    private HitStack = 0;

    onLoad() {

        GameControl.Instance = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        if (this.DefVal == null) {
            this.DefVal = Default_Value_Setting.getInstance();
        }
        if (this.DefVal.Def_Speed == null && this.DefVal.Def_FireRate == null) {
            this.DefVal.Player_Def_Value(this.Speed, this.Fire_Rate);
        }

        this.PowerManager = this.node.getComponent(PowerManager);
        this.Sound_Setting = this.node.getComponent(Sound_Setting);     

        this.Start_Btn.node.on('click', this.startGame, this);
        this.Play_Again_Btn.node.on('click', this.PlayGameAgain, this);

        this.SpawnEnemy = this.node.getComponent(Enemy_Manager);
        this.SpawnEnemy.StartEnemy_Spawner();
    }    

    public startGame() {

        this.GameRunning = true;
        this.Start_Btn.node.active = false;
        this.Panel_Hiding.active = false;
        this.Spawn_PlayerHealth();
        this.Sound_Setting.BGM_Sound.play();    
        this.SpawnEnemy.Start_Delta_Time(this.GameRunning);

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

    public CallScore() {

        if (this.GameRunning == true) {           
            this.scrorePlayer++;            
            this.SpawnEnemy.UpdateCurrentEnemy(-1);
            this.Hit_and_GetHit_Ststus(true);
            this.Score_Text.string = "Score : " + this.scrorePlayer.toString()

            let Time_Action = 0.05;
            let Down_Scale = 0.7;
            let Default_Scale = 1;
            let Hit_Bleeding = cc.sequence(cc.scaleTo(Time_Action, Down_Scale, Down_Scale), cc.scaleTo(Time_Action, Default_Scale, Default_Scale));

            this.ComboHit_Text.node.runAction(Hit_Bleeding);
        }
    }

    public Hit_and_GetHit_Ststus(Hit_Status: boolean, Damage = 0) {

        if (Hit_Status == true) {
            this.HitStack += 1;
            this.ComboHit_Text.node.active = true;
            this.ComboHit_Text.string = "HIT : " + this.HitStack.toString();

            let RoundStack_AddHP = 50;
            if (this.HitStack % RoundStack_AddHP == 0 && this.Check_MaxHP() == false) {
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
        let Distance_Node = 40;
        let movetment = cc.sequence(cc.moveBy(0.5, 0, AddHP.y + Distance_Node), cc.destroySelf());
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

    public GameOver() {

        this.GameRunning = false;
        this.Sound_Setting.BGM_Sound.stop();
        this.GameOver_Node.active = true;
        this.SpawnEnemy.Start_Delta_Time(this.GameRunning);
        let Get_GO_Text = this.GameOver_Node.children[0];

        let Time_Action = 0.2;
        let Down_Scale = 0.95;
        let Default_Scale = 1;

        let Text_Scale = cc.sequence(cc.scaleTo(Time_Action, Down_Scale, Down_Scale),
            cc.scaleTo(Time_Action, Default_Scale, Default_Scale)).repeatForever();

        Get_GO_Text.runAction(Text_Scale);
    }

    public PlayGameAgain() {
        cc.director.loadScene("ObjMovement");
    }
}

export enum TageType {

    Default = 0,
    Player = 1,
    Bullet = 2,
    Enemy = 3,
    Buff = 4,
}