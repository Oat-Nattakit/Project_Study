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

    private RangeWidth = 0;
    private RangeHight = 0;

    private Random_Rate = [10, 20, 60, 100];
    private MaxRate = 100;

    private St_Speed: Boolean = false;
    private St_Fire: Boolean = false;

    private Spawn_R_Side: Boolean = false;;

    onLoad() {

        this.GetMainScripts = GameControl.Instance;

        if (this.DefValue == null) {
            this.DefValue = Default_Value_Setting.getInstance();
        }
        this.WaitTime_Sp = this.RandomTimeSpawnBuff();
        this.RangeWidth = this.GetMainScripts.Canvas_Node.width * 0.5;
        this.RangeHight = this.GetMainScripts.Canvas_Node.height * 0.1;
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

                this.Buff_Obj.x += dt * this.SpeedBuff;
                let Buff_limitMove = this.GetMainScripts.Canvas_Node.width * 0.7;

                if (this.Spawn_R_Side == true) {
                    if (this.Buff_Obj.x >= Buff_limitMove) {
                        this.DestoryBuff_Object();
                    }
                }
                else {
                    if (this.Buff_Obj.x <= -Buff_limitMove) {
                        this.DestoryBuff_Object();
                    }
                }
            }
        }
    }

    private SpawnBuff() {

        this.RandomBuffPlayer();
        this.Buff_Obj = cc.instantiate(this.BuffPrefabs);
        this.Buff_Obj.children[this.Buff_Number].active = true;
        this.Buff_Obj.parent = this.GetMainScripts.Canvas_Node;

        this.BuffObject_Movement();
        this.Random_Silde_Buff();
        this.Spawn_Buff = true;
    }

    private RandomTimeSpawnBuff() {
        let RandomTime = (Math.floor(Math.random() * 10) + 15);
        console.log(RandomTime);
        return RandomTime;
    }

    private DestoryBuff_Object() {

        this.WaitTime_Sp = this.RandomTimeSpawnBuff();
        this.GetTime = 0;
        this.Spawn_Buff = false;
        this.Spawn_R_Side = false;
        this.Buff_Obj.destroy();
    }

    private RandomBuffPlayer() {

        let Random_Value = Math.floor(Math.random() * this.MaxRate);

        if (Random_Value <= this.Random_Rate[0]) {
            this.Buff_Number = 0;
        }
        else if (Random_Value > this.Random_Rate[0] && Random_Value <= this.Random_Rate[1]) {
            this.Buff_Number = 1;
        }
        else if (Random_Value > this.Random_Rate[1] && Random_Value <= this.Random_Rate[2]) {
            this.Buff_Number = 2;
        }
        else if (Random_Value >= this.Random_Rate[2]) {
            this.Buff_Number = 3;
        }
    }

    private Random_Silde_Buff() {

        let Ran_Num = Math.floor(Math.random() * 2);

        if (Ran_Num == 0) {
            this.Buff_Obj.setPosition(-this.RangeWidth, this.RangeHight);
            this.SpeedBuff = 150;
            this.Spawn_R_Side = true;
        }
        else {
            this.Buff_Obj.setPosition(this.RangeWidth, this.RangeHight);
            this.SpeedBuff = -150;
            this.Spawn_R_Side = false;
        }
    }

    private BuffObject_Movement() {

        let Scale_resize = cc.sequence(cc.scaleTo(0.4, 1.3, 1.3), cc.scaleTo(0.4, 0.8, 0.8)).repeatForever();
        this.Buff_Obj.runAction(Scale_resize);

        let SwingUp = cc.moveBy(this.Curve_Time, this.Buff_Obj.x, this.Buff_Obj.y + 50)
        let SwingDown = cc.moveBy(this.Curve_Time, this.Buff_Obj.x, this.Buff_Obj.y - 50)

        let BuffSwing_Move = cc.sequence(SwingUp, SwingDown).repeatForever();
        this.Buff_Obj.runAction(BuffSwing_Move);
    }

    public Player_Get_Buff() {

        /*this.Buff_Obj.destroy();
        this.Spawn_Buff = false;*/
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
            this.Fire_Count.string = ": " + this.GetMainScripts.Fire_Rate.toFixed(2);
        }
        else if (this.Buff_Number == 3) {

            if (this.St_Speed == false) {
                this.Speed_Count = this.Show_Buff_Player(this.Buff_Number).getComponentInChildren(cc.Label);
                this.St_Speed = true;
            }
            this.GetMainScripts.Speed += 100;
            this.Speed_Count.string = ": " + (this.GetMainScripts.Speed) / 100;
        }
    }

    public Player_Lost_Buff() {

        let Parent_PicBuff = this.GetMainScripts.Pos_ShowBuff;

        if (this.GetMainScripts.Fire_Rate < this.DefValue.Def_FireRate || this.GetMainScripts.Speed > this.DefValue.Def_Speed) {
            Parent_PicBuff.children.splice(0, Parent_PicBuff.childrenCount);
            this.GetMainScripts.ResetBuff_Player();
            this.St_Fire = false;
            this.St_Speed = false;
        }

        if (this.Debuff_Number != 0) {
            this.Player_Get_Debuff();
        }
    }

    private Player_Get_Debuff() {

        if (this.Debuff_Number == 2) {

            if (this.St_Fire == false) {
                this.Fire_Count = this.Show_Buff_Player(this.Debuff_Number).getComponentInChildren(cc.Label);
                this.St_Fire = true;
            }
            this.GetMainScripts.Fire_Rate += 0.05;
            this.Fire_Count.string = ": " + this.GetMainScripts.Fire_Rate.toFixed(2);
        }
        else if (this.Debuff_Number == 3) {

            if (this.St_Speed == false) {
                this.Speed_Count = this.Show_Buff_Player(this.Debuff_Number).getComponentInChildren(cc.Label);
                this.St_Speed = true;
            }
            this.GetMainScripts.Speed -= 50;
            this.Speed_Count.string = ": " + (this.GetMainScripts.Speed) / 100;
        }
    }

    Show_Buff_Player(BuffNuber) {

        let Buff_Pic = cc.instantiate(this.Buff_Picture);
        Buff_Pic.children[BuffNuber].active = true;
        Buff_Pic.parent = this.GetMainScripts.Pos_ShowBuff;
        Buff_Pic.scale = 0.5;

        return Buff_Pic.children[BuffNuber];
    }

}