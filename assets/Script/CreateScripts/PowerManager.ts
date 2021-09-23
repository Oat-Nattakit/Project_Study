// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Default_Value_Setting } from "./Default_Value_Setting";
import GameControl from "./GameControl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PowerManager extends cc.Component {

    @property(cc.Prefab)
    private BuffPrefabs: cc.Prefab = null;

    @property(cc.Prefab)
    private ShildPrefabs: cc.Prefab = null;

    @property(cc.Prefab)
    private Buff_Picture: cc.Prefab = null;

    private GetMainScripts: GameControl;
    private DefValue: Default_Value_Setting = null;
    private BUFF: BUFF_Manager = null;
    private DEBUFF: DEBUFF_Manager = null;

    private Buff_Obj: cc.Node;

    private Spawn_Buff: boolean = false;

    private Speed_Count: cc.Label;
    private Fire_Count: cc.Label;

    private Curve_Time = 0.5;
    private GetTime = 0;
    private WaitTime_Sp = 0;

    private Buff_Number = 0;
    private SpeedBuff = 150;

    public Debuff_Number = 0;

    private St_Speed: Boolean = false;
    private St_Fire: Boolean = false;

    private Spawn_R_Side: Boolean = false;;

    onLoad() {

        this.GetMainScripts = GameControl.Instance;

        if (this.DefValue == null) {
            this.DefValue = Default_Value_Setting.getInstance();
        }

        if (this.BUFF == null) {
            this.BUFF = BUFF_Manager.Buff_Inst();
        }

        if (this.DEBUFF == null) {
            this.DEBUFF = DEBUFF_Manager.Debuff_Inst();
        }


        this.WaitTime_Sp = this.RandomTimeSpawnBuff();

        let RangeWidth = this.GetMainScripts.Canvas_Node.width * 0.5;
        let RangeHight = this.GetMainScripts.Canvas_Node.height * 0.1;
        this.BUFF.SetRange(RangeWidth, RangeHight);
    }

    update(dt) {

        if (this.GetMainScripts.GameRunning == true) {

            if (this.Spawn_Buff == false) {
                this.GetTime += dt;
                if (this.GetTime >= this.WaitTime_Sp) {
                    this.SpawnBuff();
                }
            }

            if (this.Spawn_Buff == true) {

                let Buff_limitMove = this.GetMainScripts.Canvas_Node.width * 0.7;

                if (this.Spawn_R_Side == true) {

                    this.Buff_Obj.x += dt * this.SpeedBuff;

                    if (this.Buff_Obj.x >= Buff_limitMove) {
                        this.DestoryBuff_Object();
                    }
                }
                else {

                    this.Buff_Obj.x -= dt * this.SpeedBuff;

                    if (this.Buff_Obj.x <= -Buff_limitMove) {
                        this.DestoryBuff_Object();
                    }
                }
            }
        }
    }

    private RandomTimeSpawnBuff() {
        let RandomTime = (Math.floor(Math.random() * 10) + 10);
        return RandomTime;
    }

    private SpawnBuff() {

        let HP_Max = this.GetMainScripts.Check_MaxHP();
        let Shild_Active = this.GetMainScripts.BuffShild;
        this.Buff_Number = this.BUFF.RandomBuffPlayer(HP_Max, Shild_Active);

        this.Buff_Obj = cc.instantiate(this.BuffPrefabs);
        this.Buff_Obj.children[this.Buff_Number].active = true;
        this.Buff_Obj.parent = this.GetMainScripts.Canvas_Node;

        this.BUFF.BuffObject_Movement(this.Buff_Obj, this.Curve_Time);
        this.Spawn_R_Side = this.BUFF.Random_Silde_Spawn(this.Buff_Obj);

        this.Spawn_Buff = true;
    }

    private DestoryBuff_Object() {

        this.WaitTime_Sp = this.RandomTimeSpawnBuff();
        this.GetTime = 0;
        this.Spawn_Buff = false;
        this.Spawn_R_Side = false;
        this.Buff_Obj.destroy();
    }

    public Player_Get_Buff() {

        this.DestoryBuff_Object();

        if (this.Buff_Number == 0) {
            this.GetMainScripts.PlayerPlusHealth();
        }
        else if (this.Buff_Number == 1 && this.GetMainScripts.BuffShild == false) {

            let SHild = cc.instantiate(this.ShildPrefabs);
            SHild.parent = this.GetMainScripts.Player_Obj;
            SHild.runAction(cc.scaleTo(0.5, 1, 1));
            SHild.runAction(cc.rotateBy(2, -360).repeatForever());
            this.GetMainScripts.BuffShild = true;
        }
        else if (this.Buff_Number == 2) {

            if (this.St_Fire == false) {
                this.Fire_Count = this.Show_Buff_Player(this.Buff_Number).getComponentInChildren(cc.Label);
                this.St_Fire = true;
            }
            this.GetMainScripts.Fire_Rate -= 0.05;
            this.Current_Firerate();
        }
        else if (this.Buff_Number == 3) {

            if (this.St_Speed == false) {
                this.Speed_Count = this.Show_Buff_Player(this.Buff_Number).getComponentInChildren(cc.Label);
                this.St_Speed = true;
            }
            this.GetMainScripts.Speed += 100;
            this.Current_Speed();
        }
    }

    public Player_Lost_Buff() {

        if (this.GetMainScripts.Fire_Rate < this.DefValue.Def_FireRate) {
            this.Reset_Firerate();
        }
        if (this.GetMainScripts.Speed > this.DefValue.Def_Speed) {
            this.Reset_Speed();
        }

        if (this.Debuff_Number != 0) {
            this.Player_Get_Debuff();
        }
    }

    private Reset_Speed() {

        let GetParestText = this.Speed_Count.node.getParent();
        GetParestText.getParent().destroy();
        this.GetMainScripts.Speed = this.DefValue.Def_Speed;
        this.St_Speed = false;
    }

    private Reset_Firerate() {

        let GetParestText = this.Fire_Count.node.getParent();
        GetParestText.getParent().destroy();
        this.GetMainScripts.Fire_Rate = this.DefValue.Def_FireRate
        this.St_Fire = false;
    }

    private Player_Get_Debuff() {

        if (this.Debuff_Number == 2) {

            if (this.St_Fire == false) {
                this.Fire_Count = this.Show_Buff_Player(this.Debuff_Number).getComponentInChildren(cc.Label);
                this.St_Fire = true;
            }
            this.GetMainScripts.Fire_Rate += 0.05;

            this.Current_Firerate();
        }
        else if (this.Debuff_Number == 3) {

            if (this.St_Speed == false) {
                this.Speed_Count = this.Show_Buff_Player(this.Debuff_Number).getComponentInChildren(cc.Label);
                this.St_Speed = true;
            }
            this.GetMainScripts.Speed -= 50;
            this.Current_Speed();
        }
    }

    private Current_Speed() {

        if (this.GetMainScripts.Speed > this.DefValue.Def_Speed) {
            this.Speed_Count.string = ": Up";
        }
        else if (this.GetMainScripts.Speed < this.DefValue.Def_Speed) {
            this.Speed_Count.string = ": Down";
        }
        else {
            this.Reset_Speed();
        }
    }

    private Current_Firerate() {

        if (this.GetMainScripts.Fire_Rate < this.DefValue.Def_FireRate) {
            this.Fire_Count.string = ": Up";
        }
        else if (this.GetMainScripts.Fire_Rate > this.DefValue.Def_FireRate) {
            this.Fire_Count.string = ": Down";
        }
        else {
            this.Reset_Firerate();
        }

    }

    private Show_Buff_Player(BuffNuber) {

        let Buff_Pic = cc.instantiate(this.Buff_Picture);
        Buff_Pic.children[BuffNuber].active = true;
        Buff_Pic.parent = this.GetMainScripts.Pos_ShowBuff;
        Buff_Pic.scale = 0.5;

        return Buff_Pic.children[BuffNuber];
    }

}

class BUFF_Manager {

    private static BUFFPLAYER: BUFF_Manager = new BUFF_Manager();

    constructor() {
        BUFF_Manager.BUFFPLAYER = this;
    }

    public static Buff_Inst(): BUFF_Manager {
        return BUFF_Manager.BUFFPLAYER;
    }

    private RangeWidth = 0;
    private RangeHight = 0;

    public SetRange(Width, Hight) {

        this.RangeWidth = Width;
        this.RangeHight = Hight;
    }

    public RandomBuffPlayer(HP_Max, Shild) {

        let Random_Rate = [10, 20, 60];

        if (HP_Max == true) {
            Random_Rate[1] = Random_Rate[1] - Random_Rate[0];
            Random_Rate[2] = Random_Rate[2] - Random_Rate[0];
            Random_Rate[0] = -1;
        }
        if (Shild == true) {
            Random_Rate[2] = Random_Rate[2] - Random_Rate[1];
            Random_Rate[1] = -1;
        }

        let Random_Value = Math.floor(Math.random() * 100);
        let Buff_Number = 0;

        if (Random_Value > 0 && Random_Value <= Random_Rate[0]) {
            Buff_Number = 0;
        }
        else if (Random_Value > 0 && Random_Value > Random_Rate[0] && Random_Value <= Random_Rate[1]) {
            Buff_Number = 1;
        }
        else if (Random_Value > Random_Rate[1] && Random_Value <= Random_Rate[2]) {
            Buff_Number = 2;
        }
        else if (Random_Value >= Random_Rate[2]) {
            Buff_Number = 3;
        }
        return Buff_Number;
    }

    public Random_Silde_Spawn(BUFF_OBJ: cc.Node) {

        let Ran_Num = Math.floor(Math.random() * 2);
        let Spawn_R_Side = false;

        if (Ran_Num == 0) {
            BUFF_OBJ.setPosition(-this.RangeWidth, this.RangeHight);
            Spawn_R_Side = true;
        }
        else {
            BUFF_OBJ.setPosition(this.RangeWidth, this.RangeHight);
            Spawn_R_Side = false;
        }
        return Spawn_R_Side;
    }

    public BuffObject_Movement(BUFF_OBJ: cc.Node, Curve_Time) {

        let Scale_resize = cc.sequence(cc.scaleTo(0.4, 1.3, 1.3), cc.scaleTo(0.4, 0.8, 0.8)).repeatForever();
        BUFF_OBJ.runAction(Scale_resize);

        let SwingUp = cc.moveBy(Curve_Time, BUFF_OBJ.x, BUFF_OBJ.y + 50)
        let SwingDown = cc.moveBy(Curve_Time, BUFF_OBJ.x, BUFF_OBJ.y - 50)

        let BuffSwing_Move = cc.sequence(SwingUp, SwingDown).repeatForever();
        BUFF_OBJ.runAction(BuffSwing_Move);
    }
}

export class DEBUFF_Manager {

    private static DEBUFF_PLAYER: DEBUFF_Manager = new DEBUFF_Manager();

    constructor() {
        DEBUFF_Manager.DEBUFF_PLAYER = this;
    }

    public static Debuff_Inst(): DEBUFF_Manager {
        return DEBUFF_Manager.DEBUFF_PLAYER;
    }

    public Random_Buff_Bullet(Patical_Sy: cc.ParticleSystem, SpritePic: cc.Node) {

        let Rate_Buff = [5, 10, 15, 100];
        let DeBuff_Type = 0;

        let RandomBuff = Math.floor(Math.random() * 100);

        Patical_Sy.enabled = true;

        if (RandomBuff <= Rate_Buff[0]) {
            SpritePic.color = cc.Color.BLUE;
            DeBuff_Type = 1;
        }
        else if (RandomBuff > Rate_Buff[0] && RandomBuff <= Rate_Buff[1]) {
            SpritePic.color = cc.Color.YELLOW;
            DeBuff_Type = 2;
        }
        else if (RandomBuff > Rate_Buff[1] && RandomBuff <= Rate_Buff[2]) {
            SpritePic.color = cc.Color.MAGENTA;
            DeBuff_Type = 3;
        }
        else {
            Patical_Sy.enabled = false;
            SpritePic.color = cc.Color.RED;
        }
        return DeBuff_Type;
    }
}
