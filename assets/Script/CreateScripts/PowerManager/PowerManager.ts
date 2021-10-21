// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Default_Value_Setting } from "../Default_Value_Setting";
import GameControl from "../GameControl";
import { BUFF_Manager, Power_management } from "./Power_management";

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

    private PowerMan: Power_management = Power_management.instance();
    private BUFF: BUFF_Manager = null;

    private Buff_Obj: cc.Node;

    private Spawn_Buff: boolean = false;

    private Speed_Count: cc.Label;
    private Fire_Count: cc.Label;

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

        this.BUFF = this.PowerMan.PlayerBUFF;

        this.WaitTime_Sp = this.RandomTimeSpawnBuff();

        let RangeWidth = this.GetMainScripts.Canvas_Node.width * 0.5;
        let RangeHight = this.GetMainScripts.Canvas_Node.height * 0.1;

        this.BUFF.SetRange(RangeWidth, RangeHight);
    }

    update(dt) {

        if (this.GetMainScripts.GameRunning == true) {
            
            this.BUFF_Status_Active(dt);            
        }
    }

    private BUFF_Status_Active(dt) {

        if (this.Spawn_Buff == false) {
            this.GetTime += dt;
            if (this.GetTime >= this.WaitTime_Sp) {
                this.SpawnBuff();
            }
        }

        else if (this.Spawn_Buff == true) {

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

    private RandomTimeSpawnBuff() {
        let RandomTime = (Math.floor(Math.random() * 10) + 10);
        return RandomTime;
    }

    private SpawnBuff() {

        let HP_Max = this.GetMainScripts.Check_MaxHP();
        let Shild_Active = this.GetMainScripts.BuffShild;

        this.BUFF.CheckStatus_Buff_Active(HP_Max, Shild_Active);
        this.Buff_Number = this.BUFF.RandomPower();

        this.Buff_Obj = cc.instantiate(this.BuffPrefabs);
        this.Buff_Obj.children[this.Buff_Number].active = true;
        this.Buff_Obj.parent = this.GetMainScripts.Canvas_Node;

        this.BUFF.BuffObject_Movement(this.Buff_Obj);

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